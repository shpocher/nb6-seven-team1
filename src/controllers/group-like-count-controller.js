import prisma from '../utils/prisma.js';
import { NotFoundError, ValidationError } from '../middlewares/error-handler.js';
import { updateGroupBadges } from './badge-controller.js';

class GroupLikeCount {
  async groupLikeCountUp(req, res, next) {
    try {
      const groupId = Number(req.params.id);

      const findGroup = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!findGroup) {
        throw new NotFoundError('그룹을 찾을 수 없습니다');
      }

      await prisma.group.update({
        where: { id: groupId },
        data: {
          likeCount: { increment: 1 },
        },
      });

      //좋아요 뱃지 가능 여부 확인
      await updateGroupBadges(groupId);

      // API 명세서에 따라 빈 응답
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async groupLikeCountDown(req, res, next) {
    try {
      const groupId = Number(req.params.id);

      const findGroup = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!findGroup) {
        throw new NotFoundError('그룹을 찾을 수 없습니다');
      }

      if (findGroup.likeCount < 1) {
        throw new ValidationError('likeCount', '더 이상 감소할 수 없습니다');
      }

      await prisma.group.update({
        where: { id: groupId },
        data: {
          likeCount: { decrement: 1 },
        },
      });

      //좋아요 뱃지 가능 여부 확인
      await updateGroupBadges(groupId);

      // API 명세서에 따라 빈 응답
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}

export default new GroupLikeCount();
