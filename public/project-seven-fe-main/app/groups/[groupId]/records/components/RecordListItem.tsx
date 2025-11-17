'use client';

import { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames/bind';
import Card from '@/lib/components/Card';
import { Record } from '@/types/entities';
import placeholderImage from '@/public/assets/placeholder.svg';
import formatTime from '@/lib/formatTime';
import { EXERCISE_TYPE_MAP } from '@/types/entities';
import arrowRight from '@/public/assets/arrow.svg';
import styles from './RecordListItem.module.css';

const cx = classNames.bind(styles);

const RecordListItem = ({ record }: { record: Record }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasNext =
    record.photos.length > 1 && currentIndex < record.photos.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Card className={cx('recordItem')}>
      <div className={cx('imageContainer')}>
        {hasPrev && (
          <div className={cx('prevButton')} onClick={handlePrev}>
            <Image
              className={cx('prevArrowIcon')}
              src={arrowRight}
              alt="next"
              width={6}
              height={12}
            />
          </div>
        )}
        <Image
          className={cx('image')}
          src={record.photos[currentIndex] ?? placeholderImage}
          alt="record image"
          width={352}
          height={206}
        />
        {hasNext && (
          <div className={cx('nextButton')} onClick={handleNext}>
            <Image src={arrowRight} alt="next" width={6} height={12} />
          </div>
        )}
      </div>
      <div className={cx('content')}>
        <div className={cx('distance')}>{record.distance}KM</div>
        <div className={cx('description')}>{record.description}</div>
        <div className={cx('footer')}>
          <div className={cx('info')}>
            {formatTime(record.time)} · {EXERCISE_TYPE_MAP[record.exerciseType]}
          </div>
          <div className={cx('author')}>{record.author.nickname}</div>
        </div>
      </div>
    </Card>
  );
};

export default RecordListItem;
