// src/utils/date.js (수정 완료)

/**
 * 시간을 00:00:00.000으로 설정하여 날짜의 시작점을 구하는 헬퍼 함수
 */
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 📅 현재 날짜를 포함하는 주의 시작일 (일요일)을 계산합니다.
 */
export const getStartOfWeek = (today) => {
  // export 추가
  const d = startOfDay(today);
  const dayOfWeek = d.getDay();
  d.setDate(d.getDate() - dayOfWeek);
  return d;
};

/**
 * 📅 현재 날짜를 포함하는 다음 주의 시작일 (다음 주 일요일)을 계산합니다.
 */
export const getNextStartOfWeek = (today) => {
  // export 추가
  const start = getStartOfWeek(today);
  const nextWeek = new Date(start);
  nextWeek.setDate(start.getDate() + 7);
  return nextWeek;
};

/**
 * 🗓️ 현재 날짜를 포함하는 달의 시작일 (1일)을 계산합니다.
 */
export const getStartOfMonth = (today) => {
  // export 추가
  const d = new Date(today.getFullYear(), today.getMonth(), 1);
  return startOfDay(d);
};

/**
 * 🗓️ 현재 날짜를 포함하는 다음 달의 시작일 (다음 달 1일)을 계산합니다.
 */
export const getNextStartOfMonth = (today) => {
  // export 추가
  const d = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return startOfDay(d);
};

// CommonJS 구문이었던 module.exports는 제거합니다.
