import prisma from "../utils/prisma.js";
import { debugLog, debugError } from "../utils/debug.js";
import {
  NotFoundError,
  UnauthorizedError,
} from "../middlewares/error-handler.js";

class RecordController {
  // ============================================
  // POST /groups/:groupId/records - 운동 기록 생성
  // ============================================
  async createRecord(req, res) {
    const groupId = parseInt(req.params.groupId);
    const {
      exerciseType,
      description,
      time,
      distance,
      photos = [],
      authorNickname,
      authorPassword,
    } = req.body;

    debugLog("운동 기록 생성 요청:", {
      groupId,
      exerciseType,
      authorNickname,
    });

    try {
      // 1. 참여자 확인 및 검증
      const author = await prisma.participant.findUnique({
        where: {
          unique_nickname_per_group: {
            groupId,
            nickname: authorNickname,
          },
        },
      });

      if (!author || author.password !== authorPassword) {
        throw new UnauthorizedError("닉네임 또는 비밀번호가 일치하지 않습니다");
      }

      // 2. 기록 생성
      const record = await prisma.record.create({
        data: {
          exerciseType,
          description,
          time,
          distance,
          photos,
          groupId,
          authorId: author.id,
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      debugLog("운동 기록 생성 완료:", record.id);

      // 3. 디스코드 웹훅 전송 (비동기, 실패해도 무시)
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (group?.discordWebhookUrl) {
        // TODO: 디스코드 웹훅 전송 로직 구현 (추후 구현)
        debugLog("디스코드 웹훅 URL:", group.discordWebhookUrl);
      }

      // 4. 배지 업데이트 (추후 구현)
      // await updateGroupBadges(groupId);

      // API 명세에 맞는 응답 형식
      res.status(201).json(record);
    } catch (error) {
      debugError("운동 기록 생성 실패:", error);
      throw error;
    }
  }

  // ============================================
  // GET /groups/:groupId/records - 운동 기록 목록 조회
  // ============================================
  async getRecords(req, res) {
    const groupId = parseInt(req.params.groupId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order || "desc";
    const orderBy = req.query.orderBy || "createdAt";
    const search = req.query.search || "";

    debugLog("운동 기록 목록 조회:", { groupId, page, limit, order, orderBy });

    try {
      // WHERE 조건
      const where = {
        groupId,
        ...(search && {
          author: {
            nickname: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      };

      // ORDER BY
      const orderByField = { [orderBy]: order };

      // 조회
      const [records, total] = await Promise.all([
        prisma.record.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
          orderBy: orderByField,
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.record.count({ where }),
      ]);

      debugLog(`운동 기록 ${records.length}개 조회 완료 (전체: ${total})`);

      res.status(200).json({
        message: "운동 기록 목록 조회 성공",
        data: records,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      debugError("운동 기록 목록 조회 실패:", error);
      throw error;
    }
  }

  // ============================================
  // GET /groups/:groupId/records/:recordId - 운동 기록 상세 조회
  // ============================================
  async getRecordById(req, res) {
    const groupId = parseInt(req.params.groupId);
    const recordId = parseInt(req.params.recordId);

    debugLog("운동 기록 상세 조회:", { groupId, recordId });

    try {
      const record = await prisma.record.findFirst({
        where: {
          id: recordId,
          groupId, // 그룹 일치 확인
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      if (!record) {
        throw new NotFoundError("운동 기록을 찾을 수 없습니다");
      }

      debugLog("운동 기록 상세 조회 완료:", record.id);

      // API 명세에 맞는 응답 형식
      res.status(200).json(record);
    } catch (error) {
      debugError("운동 기록 상세 조회 실패:", error);
      throw error;
    }
  }
}

export default new RecordController();
