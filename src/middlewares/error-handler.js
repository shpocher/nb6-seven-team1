import { debugError } from '../utils/debug.js';

// ============================================
// [심화] Global Error Handling
// ============================================
//
// JavaScript의 기본 Error는 상태 코드를 가지지 않아서, 심화 기능의 글로벌 에러 핸들링 구현
//
// 노션 구현 안내 :
// Express.js의 Global Error Handler를 구현합니다.
// 개별 Request Handler에서 에러가 발생하는 경우, Global Error Handler에서 처리하도록 구현합니다.
//
// 사용 예시:
// throw new NotFoundError("그룹을 찾을 수 없습니다");
//     → 자동으로 404 상태 코드와 함께 응답됩니다.

/**
 * 모든 글로벌 에러 핸들러 기본 클래스
 *
 * Error를 상속받아서 JavaScript의 표준 에러처럼 작동하며,
 * 추가로 HTTP 상태 코드(statusCode)를 담음
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    // Error 클래스의 생성자 호출
    // message: 사용자에게 보여줄 에러 메시지
    super(message);

    // HTTP 응답 상태 코드
    // 200 = 성공, 404 = 찾을 수 없음, 400 = 요청 오류 등
    this.statusCode = statusCode;

    // 이 에러가 "우리가 예상한 에러"인지 표시
    // true = 예상한 에러 (클라이언트에 안내메시지를 보냄)
    //  >> 비밀번호 불일치, 그룹 못찾음, 닉네임 중복, 잘못 입력 등 -> 예상한 에러
    //  >> 상황을 미리 알고 예상된 에러이므로 클라이언트에 메시지 전달할 수 있음
    // false = 예상하지 못한 에러 (서버 내부 에러)
    //  >> 비밀번호 불일치, 그룹 못찾음, 닉네임 중복, 잘못 입력 등 -> 예상한 에러
    //  >> 예상치 못한 에러여서, 에러로그만 기록하고 자세한 정보 숨김
    this.isOperational = true;

    // Stack Treace Capture : node 기능,
    // 에러가 어느 라인에서 발생했는지 추적하기 위함
    // 에러가 발생하면, 발생 위치가 젤 먼저 나오게 해줌
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404 에러 클래스
 * 요청한 리소스(데이터, 페이지 등)를 찾을 수 없을 때 사용
 *
 * 예시:
 * const group = await prisma.group.findUnique({ where: { id: 999 } });
 * if (!group) {
 *   throw new NotFoundError("그룹을 찾을 수 없습니다");
 * }
 */
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    // AppError의 생성자를 호출하며 상태 코드 404 설정
    super(message, 404);
  }
}

/**
 * 401 에러 클래스
 * 사용자 인증/인가가 실패했을 때 사용 (주로 비밀번호 불일치 체크)
 *
 * 예시:
 * if (group.password !== inputPassword) {
 *   throw new UnauthorizedError("비밀번호가 일치하지 않습니다");
 * }
 */
export class UnauthorizedError extends AppError {
  constructor(path, message = '비밀번호가 일치하지 않습니다') {
    // 상태 코드 401
    super(message, 401);
    this.path = path;
  }
}

/**
 * 400 에러 클래스
 * 클라이언트가 보낸 요청 데이터가 잘못되었을 때 사용
 *
 * 예시:
 * if (!name) {
 *   throw new ValidationError("그룹명은 필수입니다");
 * }
 */
export class ValidationError extends AppError {
  constructor(path, message = '입력 데이터가 올바르지 않습니다') {
    // 상태 코드 400 (Bad Request)
    super(message, 400);
    this.path = path;
  }
}

/**
 * 409 에러 클래스
 * 중복된 데이터가 이미 존재할 때 사용
 *
 * 예시:
 * 같은 그룹에 같은 닉네임으로 참여하려고 할 때
 * if (존재하는_닉네임) {
 *   throw new ConflictError("이미 사용 중인 닉네임입니다");
 * }
 */
export class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다') {
    // 상태 코드 409 (Conflict)
    super(message, 409);
  }
}

// ===============================================
// 🚨 Global Error Handler (글로벌 에러 처리) 🚨
// ===============================================
//
// 모든 API 엔드포인트에서 발생하는 에러를 한 곳에서 처리
// app.js의 가장 아래에 등록되어야 함
// app.use(errorHandler);
//
// 흐름:
// 1. Controller에서 에러 발생 → throw new NotFoundError(...)
// 2. Express가 자동으로 이 함수 호출
// 3. 에러를 분석해서 적절한 응답 전송
// 4. 클라이언트에게 JSON 응답 전달

export const errorHandler = (err, req, res, next) => {
  // >> 디버그 모드에서 에러 로그 출력
  // console이 아닌 debugError 사용 (DEBUG_MODE=true일 때만 표시)
  debugError('에러 발생:', err);

  // ============================================
  // 1️. Prisma 에러 처리
  // ============================================
  // Prisma는 데이터베이스 작업에서 에러가 발생하면
  // error.code를 제공함 (P2002, P2025, P2014, P2003, P1000 등)
  // 자세한 내용: https://www.prisma.io/docs/reference/api-reference/error-reference

  // P2002: 고유 제약조건 위반
  // 예: 같은 groupId와 nickname으로 두 번 등록하려고 할 때
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: '이미 존재하는 데이터입니다',
      error: 'CONFLICT', // 클라이언트가 구분하기 쉽게 에러 타입 명시
    });
  }

  // P2025: 업데이트/삭제할 레코드를 찾을 수 없음
  // 예: 존재하지 않는 그룹을 수정하려고 할 때
  if (err.code === 'P2025') {
    return res.status(404).json({
      message: '리소스를 찾을 수 없습니다',
      error: 'NOT_FOUND',
    });
  }

  // ============================================
  // 2️. Multer 에러 처리 (파일 업로드)
  // ============================================
  // Multer는 파일 업로드 미들웨어
  // 파일 크기 초과, 잘못된 형식 등의 에러가 발생할 때 처리
  // (@호성)이미지 업로드 작업 시 활용하세요

  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: err.message, // Multer에서 제공하는 에러 메시지
      error: 'FILE_UPLOAD_ERROR',
    });
  }

  // ============================================
  // 3️. 커스텀 에러 처리
  // ============================================
  // 우리가 throw new NotFoundError(...) 같이 던진 에러들입니다.

  if (err.isOperational) {
    // 에러 클래스 이름 변환
    // NotFoundError → NOTFOUND
    // UnauthorizedError → UNAUTHORIZED
    // ValidationError → VALIDATION
    // 마지막의 "Error" 텍스트를 제거하고 대문자로 변환
    const errorType = err.constructor.name
      .replace('Error', '') // "NotFoundError" → "NotFound"
      .toUpperCase(); // "NotFound" → "NOTFOUND"

    // 기본 응답 객체 생성
    const response = {
      message: err.message, // 사용자에게 보여줄 에러 메시지
      error: errorType, // 에러 타입 (프론트엔드에서 에러 종류 구분용)
    };

    // ValidationError에서 path가 제공된 경우 응답에 포함
    // path: 어떤 필드에서 에러가 발생했는지 알려주는 정보
    // 예: { path: "nickname", message: "닉네임은 필수입니다" }
    // → 프론트엔드에서 nickname 입력란에 에러 메시지 표시 가능
    if (err.path) {
      response.path = err.path;
    }

    return res.status(err.statusCode).json(response);
  }

  // ============================================
  // 4️. 예상하지 못한 에러 처리 (기본값)
  // ============================================
  // 우리가 throw하지 않은 에러들 처리
  // 예: 메모리 부족, 데이터베이스 연결 끊김 등
  // 이외 보안성 노출하지 않는 정보 포함

  const statusCode = err.statusCode || 500; // 상태 코드 (기본값: 500 서버에러)
  const message = err.message || '서버 에러가 발생했습니다';

  res.status(statusCode).json({
    message,
    error: 'SERVER_ERROR', // 일반적인 서버 에러 응답
  });
};

// ============================================
// 🔍 404 핸들러
// ============================================
//
// 정의되지 않은 경로로 요청이 들어왔을 때 실행됩니다.
// app.js의 모든 라우터 등록 AFTER에 등록되어야 합니다:
//
// app.use(routes);
// app.use(notFoundHandler);  // ← 여기에
//
// 예: GET /asdfasdf 요청 → 이 함수 실행

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: '요청한 리소스를 찾을 수 없습니다',
    error: 'NOT_FOUND',
  });
};

// ============================================
// >>>> 사용 예시 (app.js 참고하셔도 됩니다.)
// ============================================
//
// Controller에서 사용 방법:
//
// import { NotFoundError, UnauthorizedError } from '../middlewares/error-handler.js';
//
// export async function deleteGroup(req, res) {
//   const { groupId } = req.params;
//   const { password } = req.body;
//
//   // 1. 그룹 존재 확인
//   const group = await prisma.group.findUnique({
//     where: { id: groupId }
//   });
//
//   if (!group) {
//     // ✅ 에러 던지기 → errorHandler가 자동으로 처리
//     throw new NotFoundError("그룹을 찾을 수 없습니다");
//   }
//
//   // 2. 비밀번호 확인
//   if (group.password !== password) {
//     throw new UnauthorizedError("비밀번호가 일치하지 않습니다");
//   }
//
//   // 3. 삭제
//   await prisma.group.delete({ where: { id: groupId } });
//
//   // ✅ 성공 응답
//   res.status(200).json({
//     message: "그룹이 삭제되었습니다"
//   });
// }
//
// app.js에 등록:
// import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
//
// // 모든 라우터
// app.use('/groups', groupRoutes);
//
// // 일치하는 라우터가 없으면 실행
// app.use(notFoundHandler);
//
// // 모든 에러를 여기서 처리
// app.use(errorHandler);
