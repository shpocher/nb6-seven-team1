'use client';

import classNames from 'classnames/bind';
import { useRouter } from 'next/navigation';
import { RankDuration } from '@/types/entities';
import styles from './RankTabHeader.module.css';
import Dropdown from '@/lib/components/Dropdown';

const cx = classNames.bind(styles);

const RankTabHeader = ({
  groupId,
  duration,
  participantCount,
}: {
  groupId: number;
  duration: RankDuration;
  participantCount: number;
}) => {
  const router = useRouter();

  const handleSelect = (nextDuration: string) => {
    router.push(`/groups/${groupId}/rank?duration=${nextDuration}`);
  };

  return (
    <div className={cx('container')}>
      <div className={cx('total')}>참여자 {participantCount}명</div>
      <Dropdown
        options={[
          {
            value: RankDuration.MONTHLY,
            label: '월간',
          },
          {
            value: RankDuration.WEEKLY,
            label: '주간',
          },
        ]}
        value={duration}
        onChange={handleSelect}
      />
    </div>
  );
};

export default RankTabHeader;
