import express from "express";
import healthController from "../controllers/health-controller.js";

const router = express.Router();

// 서버 상태 확인
router.get("/", healthController.checkHealth);

// 데이터베이스 연결 확인
router.get("/db", healthController.checkDatabase);

export default router;
