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
        include: { owner: true },
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
      const participants = await prisma.participant.create({
        data: { nickname, password, groupId: Number(groupId) },
      });

      //참여자 뱃지 가능 여부 확인
      await updateGroupBadges(groupId);

      //응답 구조 생성
      const responseData = {
        ...group,
        owner: {
          id: group.owner.id,
          nickname: group.owner.nickname,
          createdAt: group.owner.createdAt,
          updatedAt: group.owner.updatedAt,
        },
        participants: [
          {
            id: participants.id,
            nickname: participants.nickname,
            createdAt: participants.createdAt,
            updatedAt: participants.updatedAt,
          },
        ],
      };

      res.status(200).send(responseData);
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
