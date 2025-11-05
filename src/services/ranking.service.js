// src/services/ranking.service.js

import { PrismaClient } from "@prisma/client";
// 실제 환경에서는 config/db.js 등에서 인스턴스를 가져와야 합니다.
const prisma = new PrismaClient();

// 랭킹 결과 타입 정의 (JS 환경에서는 주석으로만 사용)
/*
export interface RankingResult {
    nickname: string;
    recordCount: number;
    totalTime: number; // 누적 시간 (초 단위)
}
*/

class RankingService {
  /**
   * 특정 기간 동안의 운동 기록을 기반으로 닉네임별 랭킹 데이터를 조회합니다.
   * @param {Date} startDate 랭킹 조회 시작일 (gte)
   * @param {Date} endDate 랭킹 조회 종료일 (lt)
   * @returns {Promise<Array<Object>>} 랭킹 데이터 배열
   */
  async getRankingData(startDate, endDate) {
    // 1. 기간 내 기록을 작성자 ID별로 그룹화하여 횟수와 시간 합산
    const rankingsByAuthor = await prisma.record.groupBy({
      by: ["authorId"],
      _count: {
        id: true, // 기록 횟수
      },
      _sum: {
        time: true, // 누적 시간
      },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate, // 종료일은 미포함
        },
      },
      orderBy: {
        _count: {
          id: "desc", // 기록 횟수 기준 내림차순 정렬
        },
      },
    });

    if (rankingsByAuthor.length === 0) {
      return [];
    }

    // 2. 랭킹 결과에 표시할 닉네임 정보를 별도로 조회
    const authorIds = rankingsByAuthor.map((r) => r.authorId);
    const participants = await prisma.participant.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, nickname: true },
    });

    const nicknameMap = new Map(participants.map((p) => [p.id, p.nickname]));

    // 3. 최종 결과 형식으로 변환 및 닉네임 매핑
    const rankingList = rankingsByAuthor.map((ranking) => ({
      nickname: nicknameMap.get(ranking.authorId) || "탈퇴/미확인 유저",
      recordCount: ranking._count.id,
      totalTime: ranking._sum.time || 0,
    }));

    return rankingList.filter((r) => r.nickname !== "탈퇴/미확인 유저");
  }
  // ⬆️ 이 메서드가 class {} 블록 내부에 확실하게 정의되어 있습니다.
}

// Named Export 방식으로 클래스 인스턴스를 내보냅니다.
export const rankingService = new RankingService();
