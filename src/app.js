import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import healthRoutes from "./routes/health-routes.js";
import { debugLog } from "./utils/debug.js";

// ES 모듈에서 __dirname 사용하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정
app.use(cors());

// JSON 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 이미지)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// 라우터 등록
app.use("/health", healthRoutes);

// ============================================
// TODO: 개발하신 라우터들을 이곳에서 구현 및 적용하시면 됩니다.
// ============================================
// app.use('/groups', groupRoutes); //예시임

// 404 핸들러
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Team1 SEVEN API Server is running on port ${PORT}`);
  debugLog("Debug mode is enabled");
  debugLog(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
