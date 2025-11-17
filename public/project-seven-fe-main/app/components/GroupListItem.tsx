'use client';

import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames/bind';
import { Group } from '@/types/entities';
import Chip from '@/lib/components/Chip';
import userImage from '@/public/assets/user.svg';
import thumbsUpImage from '@/public/assets/thumbs-up.svg';
import checkCircleImage from '@/public/assets/check-circle.svg';
import placeholderImage from '@/public/assets/placeholder.svg';
import styles from './GroupListItem.module.css';
import SafeImage from '@/lib/components/SafeImage';

const cx = classNames.bind(styles);

const GroupListItem = ({
  group,
  withMeta = true,
}: {
  group: Group;
  withMeta?: boolean;
}) => {
  return (
    <div>
      <Link className={cx('groupCard')} href={`/groups/${group.id}/records`}>
        <SafeImage
          className={cx('groupImage')}
          src={group.photoUrl || placeholderImage}
          alt="group image"
          width={93}
          height={60}
          fallback={placeholderImage}
        />
        <span className={cx('groupName')}>
          {group.name}
        </span>
        <span className={cx('groupOwner')}>by {group.owner.nickname}</span>
        <div className={cx('participantCount')}>
          <Image src={userImage} alt="user image" width={16} height={16} />
          {group.participants.length}명 참여 중
        </div>
      </Link>
      {withMeta && (
        <div className={cx('groupMeta')}>
          <div className={cx('tags')}>
            {group.tags.map((tag) => (
              <Chip key={tag}>#{tag}</Chip>
            ))}
          </div>
          <div className={cx('counts')}>
            <div className={cx('likeCount')}>
              <Image src={thumbsUpImage} width={18} height={18} alt="like" />
              {group.likeCount}
            </div>
            <div className={cx('recordCount')}>
              <Image
                src={checkCircleImage}
                width={18}
                height={18}
                alt="record"
              />
              {group.recordCount}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupListItem;
