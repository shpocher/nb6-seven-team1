import classNames from 'classnames/bind';
import Image from 'next/image';
import { BadgeType } from '@/types/entities';
import photoIconImage from '@/public/assets/photo.svg';
import thumbsUpImage from '@/public/assets/thumbs-up.svg';
import usersImage from '@/public/assets/users.svg';
import styles from './Badge.module.css';

const cx = classNames.bind(styles);

const BADGE_TYPE_MAP = {
  [BadgeType.LIKE_100]: thumbsUpImage,
  [BadgeType.PARTICIPATION_10]: usersImage,
  [BadgeType.RECORD_100]: photoIconImage,
};

const BADGE_HINT_MAP = {
  [BadgeType.LIKE_100]: '좋아요 100개',
  [BadgeType.PARTICIPATION_10]: '참여자 10명',
  [BadgeType.RECORD_100]: '사진 100장',
};

const BADGE_LABEL_MAP = {
  [BadgeType.LIKE_100]: '100+',
  [BadgeType.PARTICIPATION_10]: '10+',
  [BadgeType.RECORD_100]: '100+',
};

const Badge = ({
  className,
  badge,
}: {
  className?: string;
  badge: BadgeType;
}) => {
  return (
    <div className={cx('badge', className)}>
      <Image
        src={BADGE_TYPE_MAP[badge]}
        alt={BADGE_HINT_MAP[badge]}
        className={cx('badgeIcon')}
      />
      <span className={cx('badgeLabel')}>{BADGE_LABEL_MAP[badge]}</span>
    </div>
  );
};

export default Badge;
