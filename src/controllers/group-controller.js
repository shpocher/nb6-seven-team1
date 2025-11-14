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

      res.status(200).json({ message: '목록 생성 완료', data: groups });
    } catch (err) {
      next(err);
    }
  }

  //group 데이터 추가
  async createGroup(req, res, next) {
    try {
      // ==== 이미지 관련 추가 작업 start / 김지선 ====
      // 1. 이미지 URL 덮어쓰기 방지 및 validation 진행 한 값 분리
      const { name, goalRep, ownerId, photoUrl, ...body } = req.body;

      // 2. 검증 작업 단순화
      if (!name) {
        throw new ValidationError('그룹명은 필수입니다');
      }

      const finalGoalRep = parseInt(req.body.goalRep);
      if (!Number.isInteger(finalGoalRep) || finalGoalRep <= 0) {
        throw new ValidationError('목표 횟수는 0 이상의 수여야 합니다.');
      }

      const finalOwnerId = parseInt(req.body.ownerId);
      if (!finalOwnerId) {
        console.log(finalOwnerId);
        throw new ValidationError('소유자의 id가 없거나 인식되지 않았습니다.');
      }

      // 3. multer 파일 받아오기
      const mainImgs = req.files;

      // 4. 전달 받은 URL 변환하기
      const imgUrls = mainImgs.map((url) => `/uploads/${url.filename}`);

      // 5. 최종 photo 값(단일이면 string, 다중이면 array의 첫번쨰 값 가져옴
      const finalPhotoUrl = imgUrls.length > 0 ? imgUrls[0] : null;

      const group = await prisma.group.create({
        data: {
          ...body,
          name,
          goalRep: finalGoalRep,
          ownerId: finalOwnerId,
          photoUrl: finalPhotoUrl,
        },
      });
      // ==== 이미지 관련 추가 작업 End ====

      debugLog('group 생성 완료', group);

      res.status(201).json({ message: 'group 생성 완료', data: group });
    } catch (err) {
      debugError('group 생성 실패', err);

      next(err);
      /*
      res.status(err.statusCode).json({
      message: err.message,
      error: "SERVER_ERROR",
    });
      */
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

      res.status(200).json({ message: 'group 상세 조회 완료', data: group });
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

      if (!req.body.name) {
        throw new ValidationError('그룹명은 필수입니다');
      }

      const goalRep = parseInt(req.body.goalRep);
      if (!Number.isInteger(req.body.goalRep) || goalRep < 0) {
        throw new ValidationError('목표 횟수는 0 이상의 수여야 합니다.');
      }

      const group = await prisma.group.update({
        where: { id: Number(id) },
        data: updateData,
      });

      res.status(200).json({ message: 'group 수정 완료', data: group });
    } catch (err) {
      next(err);
    }
  }
}

export default new GroupController();
