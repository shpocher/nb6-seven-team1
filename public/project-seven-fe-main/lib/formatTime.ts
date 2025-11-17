const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return hours > 0
    ? `${hours}시간 ${minutes}분 ${seconds}초`
    : `${minutes}분 ${seconds}초`;
};

export default formatTime;
