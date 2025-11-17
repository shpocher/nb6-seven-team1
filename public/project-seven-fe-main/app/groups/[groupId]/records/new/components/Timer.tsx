'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '@/lib/components/Button';
import styles from './Timer.module.css';

const cx = classNames.bind(styles);

const Time = ({ time }: { time: number }) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  const paddedHours = hours.toString().padStart(2, '0').split('');
  const paddedMinutes = minutes.toString().padStart(2, '0').split('');
  const paddedSeconds = seconds.toString().padStart(2, '0').split('');

  return (
    <div className={cx('time')}>
      {hours > 0 && (
        <>
          <span className={cx('digit')}>{paddedHours[0]}</span>
          <span className={cx('digit')}>{paddedHours[1]}</span>
          <span className={cx('separator')}>:</span>
        </>
      )}
      <span className={cx('digit')}>{paddedMinutes[0]}</span>
      <span className={cx('digit')}>{paddedMinutes[1]}</span>
      <span className={cx('separator')}>:</span>
      <span className={cx('digit')}>{paddedSeconds[0]}</span>
      <span className={cx('digit')}>{paddedSeconds[1]}</span>
    </div>
  );
};

const Timer = ({
  onSubmit,
  onCancle,
}: {
  onSubmit: (time: number) => void;
  onCancle: () => void;
}) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const handleStart = () => setIsRunning(true);
  const handleSubmit = () => onSubmit(time);
  const handleCancle = () => onCancle();

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <div className={cx('container')}>
      <Time time={time} />
      <div className={cx('buttons')}>
        {isRunning ? (
          <Button type="button" onClick={handleSubmit}>
            종료하기
        </Button>
      ) : (
        <Button type="button" onClick={handleStart}>
          시작하기
        </Button>
      )}
      <Button type="button" appearance="minimal" onClick={handleCancle}>
        취소하기
      </Button>
      </div>
    </div>
  );
};

export default Timer;
