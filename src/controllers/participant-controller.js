import prisma from '../utils/prisma.js';
import { debugError } from '../utils/debug.js';
import {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../middlewares/error-handler.js';
import { updateGroupBadges } from './badge-controller.js';

class ParticipantController {
  async createParticipant(req, res, next) {
    try {
      const { nickname, password } = req.body;
      const { groupId } = req.params;

      //입력 검증
      if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
        throw new ValidationError('nickname', '닉네임은 필수입니다.');
      }
      if (!password || typeof password !== 'string' || password.trim() === '') {
        throw new ValidationError('password', '패스워드는 필수입니다.');
      }

      //그룹 확인
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
      });
      if (!group) {
        throw new NotFoundError('그룹을 찾을 수 없습니다.');
      }

      //닉네임 검사
      const check = await prisma.participant.findFirst({
        where: { nickname, groupId: Number(groupId) },
      });
      if (check) {
        throw new ConflictError('이미 존재하는 닉네임입니다.');
      }

      //참여자 생성
      await prisma.participant.create({
        data: { nickname, password, groupId: Number(groupId) },
      });

      //참여자 뱃지 가능 여부 확인
      await updateGroupBadges(groupId);

      // 그룹의 모든 정보를 다시 조회 (owner, 모든 participants 포함)
      const updatedGroup = await prisma.group.findUnique({
        where: { id: Number(groupId) },
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

      // 이미지 URL 처리
      const baseUrl = process.env.BASE_URL || '';
      const responseData = {
        id: updatedGroup.id,
        name: updatedGroup.name,
        description: updatedGroup.description,
        photoUrl: updatedGroup.photoUrl ? `${baseUrl}/${updatedGroup.photoUrl}` : null,
        goalRep: updatedGroup.goalRep,
        discordWebhookUrl: updatedGroup.discordWebhookUrl,
        discordInviteUrl: updatedGroup.discordInviteUrl,
        likeCount: updatedGroup.likeCount,
        tags: updatedGroup.tags,
        owner: updatedGroup.owner,
        participants: updatedGroup.participants, // 모든 참여자
        createdAt: updatedGroup.createdAt,
        updatedAt: updatedGroup.updatedAt,
        badges: updatedGroup.badges,
      };

      res.status(201).send(responseData); // 201로 변경
    } catch (error) {
      debugError('참여자 생성 실패:', error);
      next(error);
    }
  }

  async deleteParticipant(req, res, next) {
    try {
      //구현
      const { nickname, password } = req.body;
      const { groupId } = req.params;

      //입력 검증
      if (!nickname || typeof nickname !== 'string' || nickname.trim() === '') {
        throw new ValidationError('nickname', '닉네임은 필수입니다.');
      }
      if (!password || typeof password !== 'string' || password.trim() === '') {
        throw new ValidationError('password', '패스워드는 필수입니다.');
      }

      //그룹 확인
      const group = await prisma.group.findUnique({
        where: { id: Number(groupId) },
      });
      if (!group) {
        throw new NotFoundError('그룹을 찾을 수 없습니다.');
      }

      const participant = await prisma.participant.findFirst({
        where: {
          nickname,
          groupId: Number(groupId),
        },
      });
      if (!participant) {
        throw new NotFoundError('해당 닉네임의 참여자를 찾을 수 없습니다.');
      }
      if (participant.password !== password) {
        throw new UnauthorizedError('password', '비밀번호가 일치하지 않습니다.');
      }

      await prisma.participant.delete({
        where: { id: participant.id },
      });
      //참여자 뱃지 가능 여부 확인
      await updateGroupBadges(groupId);

      res.sendStatus(204);
    } catch (error) {
      debugError('참여자 탈퇴 실패:', error);
      next(error);
    }
  }
}

export default new ParticipantController();
