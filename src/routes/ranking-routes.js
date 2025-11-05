// src/routes/ranking-routes.js (수정 완료)

import express from "express";
// Controller를 import 합니다. (rankingController가 named export라고 가정)
import { rankingController } from "../controllers/ranking-controller.js";

const router = express.Router();

/**
 * 랭킹 관련 API 엔드포인트
 */

// GET /api/ranking/weekly: 주간 운동 기록 랭킹 조회
router.get("/weekly", rankingController.getWeeklyRanking);

// GET /api/ranking/monthly: 월간 운동 기록 랭킹 조회
router.get("/monthly", rankingController.getMonthlyRanking);

// 라우터 객체를 default export 합니다. (app.js에서 import rankingRoutes from ... 로 받기 위함)
export default router;
