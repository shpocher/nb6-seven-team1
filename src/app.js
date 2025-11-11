import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { debugLog } from './utils/debug.js';

// ============================================
// 미들웨어 import
// ============================================
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

// ============================================
// 라우터 import
// ============================================
import healthRoutes from './routes/health-routes.js';
import imageRoutes from './routes/image-routes.js';
import participantRoutes from './routes/participant-routes.js';
import groupLikeCount from './routes/group-like-count-routes.js';
import rankingRoutes from './routes/ranking-routes.js';
import recordRoutes from './routes/record-routes.js';

// ============================================
// 환경 변수 설정
// ============================================
dotenv.config();

const PORT = process.env.PORT || 3001;

// ============================================
// ES Module에서 __dirname 사용하기
// ============================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// Express 앱 생성
// ============================================
const app = express();

// ============================================
// 미들웨어 설정
// ============================================

// JSON 파싱
app.use(express.json());

// URL-encoded 파싱
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 (업로드된 이미지)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ============================================
// 라우터 등록
// ============================================

// 헬스 체크
app.use('/health', healthRoutes);

// ============================================
// TODO: 개발하신 라우터들을 이곳에서 구현 및 적용하시면 됩니다.
// ============================================

// 1. 이미지 업로드 API
app.use('/images', imageRoutes);

// 2. 그룹 관련 라우터들
app.use("/groups", groupRouter);
app.use('/groups', participantRoutes); // /groups/:groupId/participants
app.use('/groups', groupLikeCount); // /groups/:groupId/like
app.use('/groups', rankingRoutes); // /groups/:groupId/rank
app.use('/groups/:groupId/records', recordRoutes); // /groups/:groupId/records

// ============================================
// 404 핸들러
// ============================================
app.use(notFoundHandler);

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

// ============================================
// 서버 시작
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Team1 SEVEN API Server is running on port ${PORT}`);
  debugLog('Debug mode is enabled');
  debugLog(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
