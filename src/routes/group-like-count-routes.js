import express from 'express';
import groupLikeCountController from '../controllers/group-like-count-controller.js';

const router = express.Router();

// 기존 명세는 /groups/:id/like(단수)를 사용하고 있었으므로 두 경로 모두 지원
router.post('/:id/likes', groupLikeCountController.groupLikeCountUp);
router.delete('/:id/likes', groupLikeCountController.groupLikeCountDown);
router.post('/:id/like', groupLikeCountController.groupLikeCountUp);
router.delete('/:id/like', groupLikeCountController.groupLikeCountDown);

export default router;
