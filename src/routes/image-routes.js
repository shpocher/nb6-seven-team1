// src/routes/image-routes.js
import express from 'express';
import { uploadMulti } from '../middlewares/upload.js';
import { handleUpload } from '../controllers/image-controller.js';

const router = express.Router();

router.post('/', uploadMulti, handleUpload);

export default router;
