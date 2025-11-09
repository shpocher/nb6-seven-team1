import { ValidationError } from '../middlewares/error-handler.js';

// ============================================
// 운동 기록 생성 검증
// ============================================

export function validateRecordCreate(req, res, next) {
  const { exerciseType, description, time, distance, photos, authorNickname, authorPassword } =
    req.body;

  // 필수 필드 검증
  if (!exerciseType) {
    return next(new ValidationError('exerciseType', '운동 종류는 필수입니다'));
  }

  if (!['run', 'bike', 'swim'].includes(exerciseType)) {
    return next(
      new ValidationError('exerciseType', '운동 종류는 달리기, 자전거, 수영 중 하나여야 합니다'),
    );
  }

  if (!description) {
    return next(new ValidationError('description', '설명은 필수입니다'));
  }

  if (time === undefined || time === null) {
    return next(new ValidationError('time', '운동 시간은 필수입니다'));
  }

  if (typeof time !== 'number' || time <= 0) {
    return next(new ValidationError('time', '운동 시간은 0보다 큰 숫자여야 합니다'));
  }

  if (distance === undefined || distance === null) {
    return next(new ValidationError('distance', '거리는 필수입니다'));
  }

  if (typeof distance !== 'number' || distance < 0) {
    return next(new ValidationError('distance', '거리는 0 이상의 숫자여야 합니다'));
  }

  if (!authorNickname) {
    return next(new ValidationError('authorNickname', '닉네임은 필수입니다'));
  }

  if (!authorPassword) {
    return next(new ValidationError('authorPassword', '비밀번호는 필수입니다'));
  }

  // photos 검증 (선택)
  if (photos) {
    if (!Array.isArray(photos)) {
      return next(new ValidationError('photos', '사진은 배열 형태여야 합니다'));
    }

    if (photos.length > 3) {
      return next(new ValidationError('photos', '사진은 최대 3장까지 업로드 가능합니다'));
    }
  }

  next();
}

// ============================================
// 운동 기록 목록 조회 쿼리 검증
// ============================================

export function validateRecordQuery(req, res, next) {
  const { page, limit, order, orderBy } = req.query;

  // page 검증
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return next(new ValidationError('page', 'page는 1 이상의 숫자여야 합니다'));
  }

  // limit 검증
  if (limit && (isNaN(limit) || parseInt(limit) < 1)) {
    return next(new ValidationError('limit', 'limit는 1 이상의 숫자여야 합니다'));
  }

  // order 검증
  if (order && !['asc', 'desc'].includes(order)) {
    return next(new ValidationError('order', 'order는 asc 또는 desc여야 합니다'));
  }

  // orderBy 검증
  if (orderBy && !['createdAt', 'time'].includes(orderBy)) {
    return next(new ValidationError('orderBy', 'orderBy는 createdAt 또는 time이어야 합니다'));
  }

  next();
}
