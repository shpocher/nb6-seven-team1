// src/utils/date-range.js
export function getRange(duration = 'weekly') {
  const now = new Date();

  // 주간 날짜 계산
  if (duration === 'weekly') {
    const weekStart = new Date(now);
    const currentWeekday = weekStart.getDay();
    // 월요일을 0으로 시작하고 오늘까지 며칠 지났는가 계산
    const daysFromMonday = (currentWeekday + 6) % 7;
    // 오늘 날짜 - 지난 일수 = 월요일 날짜 기준
    weekStart.setDate(weekStart.getDate() - daysFromMonday);
    // weekStart: 월요일 0시0분0초0밀리초로 시작
    weekStart.setHours(0, 0, 0, 0);
    return { start: weekStart, end: now };
  }
  // 월간 날짜 계산
  if (duration === 'monthly') {
    // 현재 년도/월/1일 계산
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    // 1일 자정 0시0분0초0밀리초로 시작
    monthStart.setHours(0, 0, 0, 0);

    return { start: monthStart, end: now };
  }
  // 이상한 값 들어오면 컨트롤러에게 에러 던지기
  return null;
}
