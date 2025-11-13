import express from 'express';
import groupController from '../controllers/group-controller.js';

// 이미지 관련 추가 작업
import { uploadMulti } from '../middlewares/upload.js';

const groupRouter = express.Router();

groupRouter
  .get('/', groupController.getGroupList)
  .get('/:id', groupController.getGroupDetail)
  // .post('/', groupController.createGroup) // 기존 post
  .post('/', uploadMulti, groupController.createGroup) //img 업로드 미들웨어 추가
  .delete('/:id', groupController.deleteGroup)
  .patch('/:id', groupController.patchGroup);

export default groupRouter;
