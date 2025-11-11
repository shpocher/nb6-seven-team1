// src/controllers/ranking-controller.js
import prisma from '../utils/prisma.js';
import { NotFoundError, ValidationError } from '../middlewares/error-handler.js';
import { getRange } from '../utils/date-range.js';

class RankingController {
  async getGroupRanking(req, res, next) {
    try {
      const groupId = Number(req.params.groupId);
      // 쿼리 입력 없으면 기본값 주간 설정
      const duration = (req.query.duration || 'weekly').toString();

      // groupId 숫자 입력 검증
      if (!Number.isInteger(groupId)) {
        const err = new ValidationError('groupId must be integer');
        err.path = 'groupId';
        throw err;
      }
      // duration 쿼리 입력 검증
      if (!['weekly', 'monthly'].includes(duration)) {
        const err = new ValidationError('duration must be weekly or monthly');
        err.path = 'duration';
        throw err;
      }

      // DB에 groupId 실제 검증
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      if (!group) {
        throw new NotFoundError('cannot find group');
      }

      // 랭킹 기간 계산 검증 (null이면 에러 던짐)
      const rankingRange = getRange(duration);
      if (!rankingRange) {
        const err = new ValidationError('invalid duration');
        err.path = 'duration';
        throw err;
      }

      // 운동 기록/갯수/누적 합계
      const participantStats = await prisma.record.groupBy({
        by: ['authorId'],
        where: {
          groupId,
          authorId: { not: null }, // authorId가 null이면 레코드 제외
          createdAt: { gte: rankingRange.start, lte: rankingRange.end },
          // 이번 주/이번 달 기간 내 기록만 포함
        },
        _count: { _all: true }, // 활동 횟수
        _sum: { time: true }, // 활동 누적 시간
        orderBy: [
          { _count: { authorId: 'desc' } }, // 기록 많은 순
          { _sum: { time: 'desc' } }, // 기록 동일하면 누적 시간 많은 순
        ],
        take: 10, // 상위 10위
      });

      if (participantStats.length === 0) {
        return res.status(200).json([]); // 데이터 없으면 빈 배열 응답
      }

      // 랭킹 등록된 참여자 닉네임 매핑
      // 참여자 ID 추출
      const participantIdList = participantStats.map((row) => row.authorId);
      // DB 닉네임 조회
      const participantNicknameList = await prisma.participant.findMany({
        where: { id: { in: participantIdList } },
        select: { id: true, nickname: true },
      });
      // ID/닉네임 매핑
      const nicknameMap = new Map(
        participantNicknameList.map((profile) => [profile.id, profile.nickname]),
      );

      // 응답 바디 (DB 아이디 삭제 시 응답 보장)
      const rankingResponse = participantStats.map((row) => ({
        participantId: row.authorId,
        nickname: nicknameMap.get(row.authorId) ?? 'Unknown',
        recordCount: row._count._all,
        recordTime: row._sum.time ?? 0,
      }));

      return res.status(200).json(rankingResponse);
    } catch (err) {
      return next(err);
    }
  }
}

export default new RankingController();
