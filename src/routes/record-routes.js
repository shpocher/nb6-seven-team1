import express from 'express';
import recordController from '../controllers/record-controller.js';
import { validateRecordCreate, validateRecordQuery } from '../validators/record-validator.js';

const router = express.Router({ mergeParams: true }); // mergeParams로 :groupId 사용 가능

// ============================================
// 운동 기록 관련 라우트
// ============================================

// GET /groups/:groupId/records - 운동 기록 목록 조회
router.get('/', validateRecordQuery, recordController.getRecords);

// POST /groups/:groupId/records - 운동 기록 생성
router.post('/', validateRecordCreate, recordController.createRecord);

// GET /groups/:groupId/records/:recordId - 운동 기록 상세 조회
router.get('/:recordId', recordController.getRecordById);

export default router;
