import {
  NotFoundError,
  ValidationError,
} from "../middlewares/error-handler.js";
import { debugError, debugLog } from "../utils/debug.js";
import prisma from "../utils/prisma.js";

class GroupController {
  //group 데이터 목록 조회
  async getGroup(req, res) {
    const {
      page = 1,
      limit = 10,
      order = "createdAt",
      sort = "desc",
    } = req.query;

    let orderBy;

    switch (order) {
      case "participantCount":
        if (sort === "asc") {
          orderBy = { participants: { _count: "acs" } };
        } else {
          orderBy = { participants: { _count: "desc" } };
        }
        break;
      case "likeCount":
        if (sort === "asc") {
          orderBy = { likeCount: "asc" };
        } else {
          orderBy = { likeCount: "desc" };
        }
        break;
      case "createdAt":
        if (sort === "asc") {
          orderBy = { createdAt: "asc" };
        } else {
          orderBy = { createdAt: "desc" };
        }
        break;
      default:
        throw new ValidationError(
          `order은 반드시 ["createdAt", "likeCount", "participantCount"] 중 하나여야 합니다.`
        );
    }

    const group = await prisma.group.findMany({
      orderBy,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      select: {
        // id: true,
        name: true,
        // description: true,
        // photoUrl: true,
        // goalRep: true,
        // discordWebhookUrl: true,
        // discordInviteUrl: true,
        // likeCount: true,
        // tags: true,
        // owner: true,
        //participants: true,
        // createdAt: true,
        // updatedAt: true,
        // badges: true,
      },
    });

    if (!group) {
      throw new NotFoundError("group 목록을 찾을 수 없습니다.");
    }
    res.status(200).json({ message: "목록 생성 완료", data: group });
  }

  //group 데이터 추가
  async createGroup(req, res) {
    try {
      if (!req.body.name) {
        throw new ValidationError("그룹명은 필수입니다");
      }

      if (!Number.isInteger(req.body.goalRep)) {
        throw new ValidationError("목표 횟수는 숫자여야 합니다.");
      }

      if (req.body.goalRep <= 0) {
        throw new ValidationError("목표 횟수는 0 이상이어야 합니다.");
      }

      const group = await prisma.group.create({
        data: req.body,
      });

      debugLog("group 생성 완료", group);

      res.status(201).json({ message: "group 생성 완료", data: group });
    } catch (err) {
      debugError("group 생성 실패", err);
      throw err;
    }
  }
}

export default new GroupController();
