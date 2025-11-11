// src/routes/ranking-routes.js
import express from 'express';
import rankingController from '../controllers/ranking-controller.js';

const router = express.Router();

router.get('/:groupId/rank', rankingController.getGroupRanking);

export default router;
