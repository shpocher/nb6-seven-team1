// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// UPLOAD_DIR: 절대 경로 public/uploads
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads');

// 실제 파일 경로 + 확장자(ext) 검사
const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const fileNameWithoutExt = path.parse(file.originalname).name;
    cb(null, `${fileNameWithoutExt}.jpg`);
  },
});

// MIME 타입 검사 (jpg만 허용)
function fileFilter(_req, file, cb) {
  if (file.mimetype !== 'image/jpeg') {
    return cb(new Error('File should be an image file'));
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
