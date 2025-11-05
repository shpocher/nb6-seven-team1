// src/controllers/ranking-controller.js (수정 완료)

// Service와 Utils 파일을 import 합니다.
import { rankingService } from "../services/ranking.service.js";
import {
  getStartOfWeek,
  getNextStartOfWeek,
  getStartOfMonth,
  getNextStartOfMonth,
} from "../utils/date.js";

class RankingController {
  /**
   * 📅 주간 랭킹 조회 핸들러: GET /api/ranking/weekly
   */
  getWeeklyRanking = async (req, res, next) => {
    try {
      const today = new Date();
      const startDate = getStartOfWeek(today);
      const endDate = getNextStartOfWeek(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );

      res.status(200).json({
        message: "주간 랭킹 조회 성공",
        data: rankingList,
      });
    } catch (error) {
      // Global Error Handler로 에러 전달
      next(error);
    }
  };

  /**
   * 🗓️ 월간 랭킹 조회 핸들러: GET /api/ranking/monthly
   */
  getMonthlyRanking = async (req, res, next) => {
    try {
      const today = new Date();
      const startDate = getStartOfMonth(today);
      const endDate = getNextStartOfMonth(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );

      res.status(200).json({
        message: "월간 랭킹 조회 성공",
        data: rankingList,
      });
    } catch (error) {
      // Global Error Handler로 에러 전달
      next(error);
    }
  };
}

// Controller 클래스의 인스턴스를 named export 합니다.
export const rankingController = new RankingController();
