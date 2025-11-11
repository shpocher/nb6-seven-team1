// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOAD_DIR: 절대 경로 public/uploads
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

// 실제 파일 경로 + 확장자(ext)
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowExt = ['.jpg', '.jpeg', '.png'];

    if (!allowExt.includes(ext)) {
      const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
      error.message = 'jpg/png 형식의 이미지 파일만 업로드할 수 있어요.';
      return cb(error);
    }
    // 파일 이름 중복 방지 (랜덤 uuid)
    cb(null, crypto.randomUUID() + ext);
  },
});

// MIME 타입 검사 (실제 이미지 타입인지)
function fileFilter(_req, file, cb) {
  const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);

  if (!ok) {
    const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE');
    error.message = 'jpg/png 형식의 이미지 파일만 업로드할 수 있어요.';
    return cb(error);
  }

  cb(null, true);
}

// 파일 크기 제한 (5MB)
const limits = { fileSize: 5 * 1024 * 1024 };

// 단일 + 다중 포함
export const uploadMulti = multer({
  storage,
  fileFilter,
  limits,
}).array('images', 10);
