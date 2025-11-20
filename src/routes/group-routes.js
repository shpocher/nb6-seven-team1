import express from 'express';
import groupController from '../controllers/group-controller.js';

// 이미지 관련 추가 작업
import { uploadMulti } from '../middlewares/upload.js';
import groupLikeCount from '../controllers/group-like-count-controller.js';

const groupRouter = express.Router();

groupRouter
  .get('/', groupController.getGroupList)
  .get('/:id', groupController.getGroupDetail)
  .post('/', uploadMulti, groupController.createGroup) //img 업로드 미들웨어 추가
  .delete('/:id', groupController.deleteGroup)
  .patch('/:id', uploadMulti, groupController.patchGroup) //img 업로드 미들웨어 추가
  .post('/:id/likes', groupLikeCount.groupLikeCountUp)
  .delete('/:id/likes', groupLikeCount.groupLikeCountDown);

export default groupRouter;
