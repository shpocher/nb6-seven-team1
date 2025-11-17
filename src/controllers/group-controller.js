import { NotFoundError, UnauthorizedError, ValidationError } from '../middlewares/error-handler.js';
import { debugError, debugLog } from '../utils/debug.js';
import prisma from '../utils/prisma.js';

class GroupController {
  //group 데이터 목록 조회
  async getGroupList(req, res, next) {
    try {
      //목록 조회 쿼리 default값
      const { page = 1, limit = 10, order = 'createdAt', sort = 'desc', name } = req.query;

      //order 쿼리로 group데이터 출력 기준 및 순서 변경
      if (sort !== 'asc' && sort !== 'desc') {
        throw new ValidationError('sort는 반드시 [asc, desc] 중 하나여야 합니다.');
      }

      let orderBy;

      switch (order) {
        case 'participantCount':
          orderBy = { participants: { _count: sort } };
          break;
        case 'likeCount':
          orderBy = { likeCount: sort };
          break;
        case 'createdAt':
          orderBy = { createdAt: sort };
          break;
        default:
          throw new ValidationError(
            `order은 반드시 [createdAt, likeCount, participantCount] 중 하나여야 합니다.`,
          );
      }

      //where을 통해 group 이름으로 검색이 가능하게 만듬
      //group 이름의 일부가 입력되어도 존재한다면 group이 호출될수 있도록 함
      //영어로 적혀있으면 대소문자 상관없이 호출될 수 있도록 함
      const groups = await prisma.group.findMany({
        orderBy,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });

      //group 목록이 빈 배열로 나오는 것을 404 error로 처리할 필요가 있을때 밑의 코드 활성화.
      // if (group.length === 0) {
      //   throw new NotFoundError("group 목록을 찾을 수 없습니다.");
      // }

      // Group Img 경로 제공을 위해 response 값 변환
      const baseUrl = process.env.BASE_URL || '';
      const groupsResponse = groups.map((group) => {
        return { ...group, photoUrl: group.photoUrl ? `${baseUrl}/${group.photoUrl}` : null };
      });

      res.status(200).json({ message: '목록 생성 완료', data: groupsResponse });
    } catch (err) {
      next(err);
    }
  }

  //group 데이터 추가
  async createGroup(req, res, next) {
    try {
      const { name, goalRep, photoUrl, ownerNickname, ownerPassword, ...body } = req.body;

      // 1. 필수 필드 검증
      if (!name) {
        throw new ValidationError('name', '그룹명은 필수입니다');
      }

      if (!ownerNickname) {
        throw new ValidationError('ownerNickname', '소유자 닉네임은 필수입니다');
      }

      if (!ownerPassword) {
        throw new ValidationError('ownerPassword', '소유자 비밀번호는 필수입니다');
      }

      const finalGoalRep = parseInt(goalRep);
      if (!Number.isInteger(finalGoalRep) || finalGoalRep < 0) {
        throw new ValidationError('goalRep', '목표 횟수는 0 이상의 정수여야 합니다');
      }

      // 2. multer 파일 받아오기
      const mainImgs = req.files;
      const finalPhotoUrl =
        mainImgs && mainImgs.length > 0 ? `uploads/${mainImgs[0].filename}` : null;

      // 3. Owner(Participant) 생성과 함께 Group 생성
      const group = await prisma.group.create({
        data: {
          ...body,
          name,
          goalRep: finalGoalRep,
          photoUrl: finalPhotoUrl,
          owner: {
            create: {
              nickname: ownerNickname,
              password: ownerPassword,
            },
          },
        },
        include: {
          owner: {
            select: {
              id: true,
              nickname: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          participants: {
            select: {
              id: true,
              nickname: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      debugLog('group 생성 완료', group);

      // 4. 응답 데이터 생성
      const baseUrl = process.env.BASE_URL || '';
      const groupResponse = {
        id: group.id,
        name: group.name,
        description: group.description,
        photoUrl: group.photoUrl ? `${baseUrl}/${group.photoUrl}` : null,
        goalRep: group.goalRep,
        discordWebhookUrl: group.discordWebhookUrl,
        discordInviteUrl: group.discordInviteUrl,
        likeCount: group.likeCount,
        tags: group.tags,
        owner: group.owner,
        participants: group.participants,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        badges: group.badges,
      };

      res.status(201).json(groupResponse);
    } catch (err) {
      debugError('group 생성 실패', err);
      next(err);
    }
  }

  //group 상세내역 호출
  async getGroupDetail(req, res, next) {
    try {
      const { id } = req.params;

      const group = await prisma.group.findUnique({
        where: { id: Number(id) },
      });

      if (!group) {
        throw new NotFoundError('group ID가 존재하지 않습니다.');
      }

      // Group Img 경로 제공을 위해 response 값 변환
      const baseUrl = process.env.BASE_URL || '';
      const groupResponse = {
        ...group,
        photoUrl: group.photoUrl ? `${baseUrl}/${group.photoUrl}` : null,
      };

      res.status(200).json({ message: 'group 상세 조회 완료', data: groupResponse });
    } catch (err) {
      debugError('group 호출 실패', err);
      next(err);
    }
  }

  //특정 group 삭제
  async deleteGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { pw } = req.body;
      const group = await prisma.group.findUnique({
        where: { id: Number(id) },
        select: {
          owner: {
            select: {
              password: true,
            },
          },
        },
      });

      if (!group) {
        throw new NotFoundError('group ID가 존재하지 않습니다.');
      }

      if (!group.owner) {
        throw new UnauthorizedError('group owner의 정보를 찾을 수 없습니다.');
      }

      const ownerPassword = group.owner.password;
      debugLog(ownerPassword);

      if (pw !== ownerPassword) {
        throw new UnauthorizedError('group owner의 비밀번호가 틀렸습니다.');
      }

      await prisma.group.delete({
        where: { id: Number(id) },
      });

      res.status(200).json({ message: 'group이 성공적으로 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }

  //특정 group 수정
  async patchGroup(req, res, next) {
    try {
      const { id } = req.params;
      const { pw, ...updateData } = req.body;
      let dataToUpdate = { ...updateData };

      const findGroup = await prisma.group.findUnique({
        where: { id: Number(id) },
        select: {
          owner: {
            select: {
              password: true,
            },
          },
        },
      });

      if (!findGroup) {
        throw new NotFoundError('group ID가 존재하지 않습니다.');
      }

      if (!findGroup.owner) {
        throw new UnauthorizedError('group owner의 정보를 찾을 수 없습니다.');
      }

      const ownerPassword = findGroup.owner.password;
      debugLog(ownerPassword);

      if (pw !== ownerPassword) {
        throw new UnauthorizedError('group owner의 비밀번호가 틀렸습니다.');
      }

      if (!updateData.name) {
        throw new ValidationError('그룹명은 필수입니다');
      }

      console.log(updateData.goalRep);

      dataToUpdate.goalRep = parseInt(updateData.goalRep);
      if (!Number.isInteger(dataToUpdate.goalRep) || dataToUpdate.goalRep < 0) {
        throw new ValidationError('목표 횟수는 0 이상의 수여야 합니다.');
      }

      // 미들웨어를 사용하여 이미지 파일 받아오기
      const mainImgs = req.files;

      if (mainImgs && mainImgs.length > 0) {
        dataToUpdate.photoUrl = `uploads/${mainImgs[0].filename}`;
      }

      const group = await prisma.group.update({
        where: { id: Number(id) },
        data: dataToUpdate,
      });

      // Group Img 경로 제공을 위해 response 값 변환
      const baseUrl = process.env.BASE_URL || '';
      const groupResponse = {
        ...group,
        photoUrl: group.photoUrl ? `${baseUrl}/${group.photoUrl}` : null,
      };

      res.status(200).json({ message: 'group 수정 완료', data: groupResponse });
    } catch (err) {
      next(err);
    }
  }
}

export default new GroupController();
