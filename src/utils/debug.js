/**
 * 디버그 플래그 관리 유틸리티
 *
 * 환경 변수 DEBUG_MODE를 통해 디버깅 로그를 제어
 * 개발 환경에서는 true, 프로덕션(배포) 환경에서는 false로 설정
 *
 * @example
 * // .env 파일
 * DEBUG_MODE=true
 *
 * @example
 * // 사용 예시
 * import { debugLog, debugError } from './utils/debug.js';
 *
 * debugLog('사용자 데이터:', userData);
 * debugError('에러 발생:', error);
 */

const DEBUG_MODE = process.env.DEBUG_MODE === "true";

/**
 * 디버그 모드일 때만 일반 로그 출력
 * @param  {...any} args - 출력할 내용
 * @example
 * debugLog('그룹 ID:', groupId);
 * debugLog('요청 데이터:', req.body);
 */
export const debugLog = (...args) => {
  if (DEBUG_MODE) {
    console.log("[DEBUG]", ...args);
  }
};

/**
 * 디버그 모드일 때만 에러 로그 출력
 * @param  {...any} args - 출력할 내용
 * @example
 * debugError('데이터베이스 연결 실패:', error);
 */
export const debugError = (...args) => {
  if (DEBUG_MODE) {
    console.error("[DEBUG ERROR]", ...args);
  }
};

/**
 * 디버그 모드일 때만 경고 로그 출력
 * @param  {...any} args - 출력할 내용
 * @example
 * debugWarn('Deprecated 함수 사용:', functionName);
 */
export const debugWarn = (...args) => {
  if (DEBUG_MODE) {
    console.warn("[DEBUG WARN]", ...args);
  }
};

/**
 * 디버그 모드 여부 확인
 * @returns {boolean} 디버그 모드 활성화 여부
 * @example
 * if (isDebugMode()) {
 *   // 디버그 전용 로직
 * }
 */
export const isDebugMode = () => DEBUG_MODE;

/**
 * 디버그 모드일 때만 특정 함수 실행
 * @param {Function} fn - 실행할 함수
 * @example
 * runInDebugMode(() => {
 *   console.table(users);
 * });
 */
export const runInDebugMode = (fn) => {
  if (DEBUG_MODE && typeof fn === "function") {
    fn();
  }
};

/**
 * API 응답 시간을 측정하는 미들웨어용 헬퍼
 * @param {string} label - 측정 라벨
 * @returns {Function} 시간 측정 종료 함수
 * @example
 * const endTimer = startTimer('그룹 조회');
 * // ... 로직 실행
 * endTimer();
 */
export const startTimer = (label) => {
  if (!DEBUG_MODE) {
    return () => {}; // no-op
  }

  const startTime = Date.now();
  return () => {
    const endTime = Date.now();
    debugLog(`[타이머] ${label}: ${endTime - startTime}ms`);
  };
};

/**
 * 객체를 보기 좋게 출력 (디버그용)
 * @param {Object} obj - 출력할 객체
 * @param {string} label - 라벨 (선택)
 * @example
 * debugObject(user, '사용자 정보');
 */
export const debugObject = (obj, label = "Object") => {
  if (DEBUG_MODE) {
    console.log(`[DEBUG ${label}]`);
    console.dir(obj, { depth: null, colors: true });
  }
};

/**
 * 배열/객체를 테이블 형태로 출력 (디버그용)
 * @param {Array|Object} data - 출력할 데이터
 * @param {string} label - 라벨 (선택)
 * @example
 * debugTable(users, '사용자 목록');
 */
export const debugTable = (data, label = "") => {
  if (DEBUG_MODE) {
    if (label) {
      console.log(`[DEBUG] ${label}`);
    }
    console.table(data);
  }
};
