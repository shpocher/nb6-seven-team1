import prisma from "../utils/prisma.js";
import { NotFoundError } from "../middlewares/error-handler.js";

class GroupLikeCount {
  async groupLikeCountUp(req, res, next) {
    try {
      const groupId = Number(req.params.id);

      const findGroup = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (!findGroup) {
        throw new NotFoundError("그룹을 찾을 수 없습니다");
      }

      const likeCountUp = await prisma.group.update({
        where: { id: groupId },
        data: {
          likeCount: { increment: 1 },
        },
      });

      res.status(200).json({
        message: "그룹 추천 성공",
        data: {
          id: likeCountUp.id,
          likeCount: likeCountUp.likeCount,
        },
      });
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
        throw new NotFoundError("그룹을 찾을 수 없습니다");
      }

      if (findGroup.likeCount < 1) {
        throw new NotFoundError("더 이상 감소할 수 없습니다");
      }

      const likeCountDown = await prisma.group.update({
        where: { id: groupId },
        data: {
          likeCount: { decrement: 1 },
        },
      });

      res.status(200).json({
        message: "그룹 추천 취소 성공",
        data: {
          id: likeCountDown.id,
          likeCount: likeCountDown.likeCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new GroupLikeCount();
