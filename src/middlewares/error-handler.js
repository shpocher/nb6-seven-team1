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
// ⚠️ 중요: Controller에서는 반드시 next(error)를 사용해야 합니다!
//          try-catch 블록 안에서 throw error를 사용하면 제대로 작동하지 않을 수 있습니다.

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
    //  >> 메모리 부족, DB 연결 끊김, 알 수 없는 에러 등 -> 예상치 못한 에러
    //  >> 예상치 못한 에러여서, 에러로그만 기록하고 자세한 정보 숨김
    this.isOperational = true;
    this.path = null; // 프론트엔드 필드 식별용
    // Stack Trace Capture : node 기능,
    // 에러가 어느 라인에서 발생했는지 추적하기 위함
    // 에러가 발생하면, 발생 위치가 젤 먼저 나오게 해줌
    Error.captureStackTrace(this, this.constructor);
  }
}

// ============================================
// 404 에러 클래스
// ============================================
/**
 * 404 Not Found 에러 클래스
 * 요청한 리소스(데이터, 페이지 등)를 찾을 수 없을 때 사용
 *
 * 사용 예시:
 * async function getGroup(req, res, next) {
 *   try {
 *     const group = await prisma.group.findUnique({
 *       where: { id: req.params.groupId }
 *     });
 *
 *     if (!group) {
 *       // ✅ 올바른 사용법: next()로 Global Error Handler에 전달
 *       throw new NotFoundError('그룹을 찾을 수 없습니다');
 *     }
 *
 *     res.json(group);
 *   } catch (error) {
 *     // ✅ 반드시 next(error)를 사용!
 *     next(error);
 *   }
 * }
 */
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    // AppError의 생성자를 호출하며 상태 코드 404 설정
    super(message, 404);
  }
}

// ============================================
// 401 에러 클래스
// ============================================
/**
 * 401 Unauthorized 에러 클래스
 * 사용자 인증/인가가 실패했을 때 사용 (주로 비밀번호 불일치 체크)
 * path 파라미터를 지원하여 어떤 필드의 인증이 실패했는지 명시 가능
 *
 * 사용 예시:
 * async function deleteGroup(req, res, next) {
 *   try {
 *     const { groupId } = req.params;
 *     const { password } = req.body;
 *
 *     const group = await prisma.group.findUnique({
 *       where: { id: groupId }
 *     });
 *
 *     if (!group) {
 *       throw new NotFoundError('그룹을 찾을 수 없습니다');
 *     }
 *
 *     // 비밀번호 불일치 - path 파라미터로 어떤 필드의 에러인지 명시
 *     if (group.password !== password) {
 *       // ✅ path와 message를 함께 전달
 *       throw new UnauthorizedError('password', '비밀번호가 일치하지 않습니다');
 *     }
 *
 *     await prisma.group.delete({ where: { id: groupId } });
 *     res.status(200).json({ message: '그룹이 삭제되었습니다' });
 *
 *   } catch (error) {
 *     // ✅ 반드시 next(error)를 사용!
 *     next(error);
 *   }
 * }
 *
 * 응답 예시:
 * {
 *   "path": "password",
 *   "message": "비밀번호가 일치하지 않습니다",
 *   "error": "UNAUTHORIZED"
 * }
 */
export class UnauthorizedError extends AppError {
  constructor(pathOrMessage, message = null) {
    // path 파라미터가 제공된 경우
    if (message) {
      super(message, 401);
      this.path = pathOrMessage;
    } else {
      // path 없이 message만 제공된 경우 (하위 호환성)
      super(pathOrMessage || '비밀번호가 일치하지 않습니다', 401);
    }
  }
}

// ============================================
// 400 에러 클래스
// ============================================
/**
 * 400 Validation Error 클래스
 * 입력 데이터 검증 실패 시 사용
 * path 파라미터를 지원하여 어떤 필드의 검증이 실패했는지 명시 가능
 *
 * 사용 예시 1: Validator에서 사용
 * export function validateGroupCreate(req, res, next) {
 *   const { name, description } = req.body;
 *
 *   // 필수 필드 검증
 *   if (!name) {
 *     // ✅ Validator는 반드시 return next()를 사용
 *     return next(new ValidationError('name', '그룹명은 필수입니다'));
 *   }
 *
 *   // 길이 검증
 *   if (name.length > 20) {
 *     return next(new ValidationError('name', '그룹명은 20자 이하여야 합니다'));
 *   }
 *
 *   // 검증 통과
 *   next();
 * }
 *
 * 사용 예시 2: Controller에서 사용
 * async function createGroup(req, res, next) {
 *   try {
 *     const { name, password } = req.body;
 *
 *     // 비즈니스 로직 검증
 *     if (password.length < 4) {
 *       throw new ValidationError('password', '비밀번호는 4자 이상이어야 합니다');
 *     }
 *
 *     const group = await prisma.group.create({
 *       data: { name, password }
 *     });
 *
 *     res.status(201).json(group);
 *
 *   } catch (error) {
 *     // ✅ 반드시 next(error)를 사용!
 *     next(error);
 *   }
 * }
 *
 * 응답 예시:
 * {
 *   "path": "name",
 *   "message": "그룹명은 필수입니다",
 *   "error": "VALIDATION"
 * }
 */
export class ValidationError extends AppError {
  constructor(pathOrMessage, message = null) {
    // path 파라미터가 제공된 경우
    if (message) {
      super(message, 400);
      this.path = pathOrMessage;
    } else {
      // path 없이 message만 제공된 경우 (하위 호환성)
      super(pathOrMessage || '입력 데이터가 올바르지 않습니다', 400);
    }
  }
}

// ============================================
// 409 에러 클래스
// ============================================
/**
 * 409 Conflict Error 클래스
 * 중복된 데이터가 이미 존재할 때 사용
 *
 * 사용 예시:
 * async function createParticipant(req, res, next) {
 *   try {
 *     const { nickname, password } = req.body;
 *     const { groupId } = req.params;
 *
 *     // 닉네임 중복 검사
 *     const existing = await prisma.participant.findFirst({
 *       where: { nickname, groupId }
 *     });
 *
 *     if (existing) {
 *       // ✅ 중복된 데이터가 있을 때 ConflictError 사용
 *       throw new ConflictError('이미 존재하는 닉네임입니다');
 *     }
 *
 *     const participant = await prisma.participant.create({
 *       data: { nickname, password, groupId }
 *     });
 *
 *     res.status(201).json(participant);
 *
 *   } catch (error) {
 *     // ✅ 반드시 next(error)를 사용!
 *     next(error);
 *   }
 * }
 *
 * 응답 예시:
 * {
 *   "message": "이미 존재하는 닉네임입니다",
 *   "error": "CONFLICT"
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
// 2. catch 블록에서 next(error) 호출
// 3. Express가 이 함수 자동 호출
// 4. 에러를 분석해서 적절한 응답 전송
// 5. 클라이언트에게 JSON 응답 전달

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
  // 보안상 자세한 정보는 노출하지 않음

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
// app.use('/groups', groupRoutes);
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
// 핵심 정리: next(error) vs throw error
// ============================================
//
// Express 4.x에서 async 함수의 에러 처리는 반드시 next(error)를 사용해야 함
//
// ❌ 잘못된 방법 (작동하지 않을 수 있음):
//
// async function controller(req, res) {
//   try {
//     throw new NotFoundError('에러');
//   } catch (error) {
//     throw error;  // ❌ 이렇게 하면 안 됨!
//   }
// }
//
// 문제점:
// - catch 블록에서 throw하면 Promise rejection이 발생
// - Express 4.x는 rejected promise를 처리하지 못함
// - 결과: UnhandledPromiseRejection 또는 클라이언트 timeout
// - Global Error Handler가 호출되지 않음
//
// ✅ 올바른 방법 (반드시 이렇게 사용):
//
// async function controller(req, res, next) {  // ← next 파라미터 필수!
//   try {
//     const data = await prisma.model.findUnique(...);
//
//     if (!data) {
//       throw new NotFoundError('데이터를 찾을 수 없습니다');
//     }
//
//     res.json(data);
//   } catch (error) {
//     next(error);  // ✅ 반드시 next(error)를 사용!
//   }
// }
//
// 이유:
// - next(error)는 Express의 표준 에러 전달 방식
// - Express가 에러를 받아서 글로벌에러핸들러로 전달 (의도대로 동작)
// - 모든 Express 버전에서 안전
//
// 요약:
// Controller의 catch 블록에서는 반드시 next(error)를 사용하시면 됩니다.
//
// Validator: 문제 발견 → 즉시 보고 → return next(error)
// Controller: 문제 발생 → 소리침 → throw error
// Controller: 문제 catch → 글로벌 에러 핸들러 호출 → next(error)
// ============================================

// ============================================
// 📝 완전한 사용 예시
// ============================================
//
// 1. Controller 파일 (group-controller.js):
//
// import prisma from '../utils/prisma.js';
// import {
//   NotFoundError,
//   UnauthorizedError,
//   ValidationError,
//   ConflictError
// } from '../middlewares/error-handler.js';
//
// class GroupController {
//   async deleteGroup(req, res, next) {  // ← next 파라미터 필수!
//     try {
//       const { groupId } = req.params;
//       const { password } = req.body;
//
//       // 1. 그룹 존재 확인
//       const group = await prisma.group.findUnique({
//         where: { id: parseInt(groupId) }
//       });
//
//       if (!group) {
//         // ✅ 에러 던지기 (Global Error Handler가 처리)
//         throw new NotFoundError('그룹을 찾을 수 없습니다');
//       }
//
//       // 2. 비밀번호 확인
//       if (group.password !== password) {
//         throw new UnauthorizedError('password', '비밀번호가 일치하지 않습니다');
//       }
//
//       // 3. 삭제
//       await prisma.group.delete({
//         where: { id: parseInt(groupId) }
//       });
//
//       // ✅ 성공 응답
//       res.status(200).json({
//         message: '그룹이 삭제되었습니다'
//       });
//
//     } catch (error) {
//       // ✅ 반드시 next(error)를 사용!
//       // throw error를 사용하면 안 됨!
//       next(error);
//     }
//   }
// }
//
// export default new GroupController();
//
// ============================================
//
// 2. app.js에 등록:
//
// import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
//
// // 모든 라우터 등록
// app.use('/groups', groupRoutes);
// app.use('/records', recordRoutes);
//
// // 404 핸들러 (라우터 다음에)
// app.use(notFoundHandler);
//
// // Global Error Handler (가장 마지막에!)
// app.use(errorHandler);
//
// ============================================
//
// 3. 에러 응답 예시:
//
// NotFoundError:
// {
//   "message": "그룹을 찾을 수 없습니다",
//   "error": "NOTFOUND"
// }
//
// UnauthorizedError (path 포함):
// {
//   "path": "password",
//   "message": "비밀번호가 일치하지 않습니다",
//   "error": "UNAUTHORIZED"
// }
//
// ValidationError (path 포함):
// {
//   "path": "nickname",
//   "message": "닉네임은 필수입니다",
//   "error": "VALIDATION"
// }
//
// ConflictError:
// {
//   "message": "이미 존재하는 닉네임입니다",
//   "error": "CONFLICT"
// }
//
// ============================================
