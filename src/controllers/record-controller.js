import prisma from '../utils/prisma.js';
import { debugLog } from '../utils/debug.js';
import { NotFoundError, UnauthorizedError } from '../middlewares/error-handler.js';
import {
  convertUrlsToPaths,
  convertImageFieldsToUrls,
  convertArrayImageFieldsToUrls,
} from '../utils/image-utils.js';

/**
 * 운동 기록 컨트롤러
 * 그룹의 운동 기록 생성, 조회, 목록 조회 기능 제공
 */
class RecordController {
  // ============================================
  // POST /groups/:groupId/records - 운동 기록 생성
  // ============================================
  async createRecord(req, res, next) {
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

    debugLog('운동 기록 생성 요청:', {
      groupId,
      exerciseType,
      authorNickname,
      photos, // 클라이언트가 보낸 photos (URL 배열)
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

      // 참여자가 없으면 닉네임 에러
      if (!author) {
        throw new UnauthorizedError('authorNickname', '닉네임을 찾을 수 없습니다');
      }

      // 비밀번호가 일치하지 않으면 비밀번호 에러
      if (author.password !== authorPassword) {
        throw new UnauthorizedError('authorPassword', '비밀번호가 일치하지 않습니다');
      }

      // 2. photos URL에서 경로 추출 (공통 유틸리티 사용)
      // 클라이언트가 보낸 ["http://localhost:3000/uploads/abc.jpg"]
      // → DB에 저장할 ["uploads/abc.jpg"]
      const photoPaths = convertUrlsToPaths(photos);

      debugLog('추출된 경로:', photoPaths);

      // 3. 기록 생성 (경로만 저장)
      const record = await prisma.record.create({
        data: {
          exerciseType,
          description,
          time,
          distance,
          photos: photoPaths, // ["uploads/abc.jpg"] 저장
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

      debugLog('운동 기록 생성 완료:', record.id);
      debugLog('DB에 저장된 photos:', record.photos);

      // 4. 디스코드 웹훅 전송 (비동기, 실패해도 무시)
      const group = await prisma.group.findUnique({
        where: { id: groupId },
      });

      if (group?.discordWebhookUrl) {
        // TODO: 디스코드 웹훅 전송 로직 구현 (추후 구현)
        debugLog('디스코드 웹훅 URL:', group.discordWebhookUrl);
      }

      // 5. 배지 업데이트 (추후 구현)
      // await updateGroupBadges(groupId);

      // 6. 응답: 경로를 다시 전체 URL로 변환 (공통 유틸리티 사용)
      // ["uploads/abc.jpg"] → ["http://localhost:3000/uploads/abc.jpg"]
      const recordWithUrls = convertImageFieldsToUrls(record, ['photos']);

      debugLog('응답 photos:', recordWithUrls.photos);

      // API 명세에 맞는 응답 형식
      res.status(201).json(recordWithUrls);
    } catch (error) {
      // Global Error Handler로 전달
      next(error);
    }
  }

  // ============================================
  // GET /groups/:groupId/records - 운동 기록 목록 조회
  // ============================================
  async getRecords(req, res, next) {
    const groupId = parseInt(req.params.groupId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order || 'desc';
    const orderBy = req.query.orderBy || 'createdAt';
    const search = req.query.search || '';

    debugLog('운동 기록 목록 조회:', { groupId, page, limit, order, orderBy });

    try {
      // WHERE 조건
      const where = {
        groupId,
        ...(search && {
          author: {
            nickname: {
              contains: search,
              mode: 'insensitive',
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

      // 각 record의 photos를 URL로 변환 (공통 유틸 image-utils 사용)
      // DB: ["uploads/abc.jpg"] → 응답: ["http://localhost:3000/uploads/abc.jpg"]
      const recordsWithUrls = convertArrayImageFieldsToUrls(records, ['photos']);

      res.status(200).json({
        message: '운동 기록 목록 조회 성공',
        data: recordsWithUrls,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      // Global Error Handler로 전달
      next(error);
    }
  }

  // ============================================
  // GET /groups/:groupId/records/:recordId - 운동 기록 상세 조회
  // ============================================
  async getRecordById(req, res, next) {
    const groupId = parseInt(req.params.groupId);
    const recordId = parseInt(req.params.recordId);

    debugLog('운동 기록 상세 조회:', { groupId, recordId });

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
        throw new NotFoundError('운동 기록을 찾을 수 없습니다');
      }

      debugLog('운동 기록 상세 조회 완료:', record.id);
      debugLog('DB의 photos:', record.photos);

      // photos를 URL로 변환 (공통 유틸 image-utils 사용)
      // DB: ["uploads/abc.jpg"] → 응답: ["http://localhost:3000/uploads/abc.jpg"]
      const recordWithUrls = convertImageFieldsToUrls(record, ['photos']);

      debugLog('응답 photos:', recordWithUrls.photos);

      // API 명세에 맞는 응답 형식
      res.status(200).json(recordWithUrls);
    } catch (error) {
      // Global Error Handler로 전달
      next(error);
    }
  }
}

export default new RecordController();
