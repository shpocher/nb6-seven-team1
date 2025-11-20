import Image from 'next/image';
import classNames from 'classnames/bind';
import { BadgeType, Group } from '@/types/entities';
import placeholderImage from '@/public/assets/placeholder.svg';
import GroupJoinButton from './GroupJoinButton';
import LikeButton from './LikeButton';
import Badge from './Badge';
import GroupLeaveButton from './GroupLeaveButton';
import Chip from '@/lib/components/Chip';
import userIcon from '@/public/assets/user.svg';
import discordIcon from '@/public/assets/discord.svg';
import { LinkButton } from '@/lib/components/Button';
import SettingMenu from './SettingMenu';
import styles from './GroupDetail.module.css';

const cx = classNames.bind(styles);

const BADGE_ORDER = [
  BadgeType.PARTICIPATION_10,
  BadgeType.RECORD_100,
  BadgeType.LIKE_100,
];

const sortBadges = (badges: BadgeType[]) => {
  return badges.sort((a, b) => BADGE_ORDER.indexOf(a) - BADGE_ORDER.indexOf(b));
};

const GroupDetail = ({ group }: { group: Group }) => {
  return (
    <div className={cx('container')}>
      <Image
        className={cx('thumbnail')}
        src={group.photoUrl ?? placeholderImage}
        alt="Group Image"
        width={200}
        height={200}
      />

      <div className={cx('info')}>
        <div className={cx('tags')}>
          <Chip className={cx('participants', 'tag')} appearance="dark">
            <Image src={userIcon} alt="participants" width={14} height={14} />
            <span>{group.participants.length}명 참여중</span>
          </Chip>
          {group.tags.map((tag) => (
            <Chip key={tag} className={cx('tag')} appearance="dark">
              #{tag}
            </Chip>
          ))}
        </div>
        <h1 className={cx('groupName')}>{group.name}</h1>
        <p className={cx('description')}>
          by {group.owner.nickname} · {group.description}
        </p>
        <div className={cx('goalReps')}>목표 횟수: {group.goalRep}개</div>
        <div className={cx('buttons')}>
          <LikeButton
            className={cx('button')}
            groupId={group.id}
            likeCount={group.likeCount}
          />
          <LinkButton
            className={cx('discordButton', 'button')}
            href={group.discordInviteUrl ?? ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={discordIcon} alt="discord" width={24} height={24} />
            <span>디스코드</span>
          </LinkButton>
        </div>
      </div>
      <div className={cx('actions')}>
        <GroupLeaveButton className={cx('action')} groupId={group.id} />
        <GroupJoinButton className={cx('action')} groupId={group.id} />
      </div>
      <SettingMenu className={cx('settingButton')} groupId={group.id} />
      <div className={cx('badges')}>
        {sortBadges(group.badges).map((badge) => (
          <Badge key={badge} className={cx('badge')} badge={badge} />
        ))}
      </div>
    </div>
  );
};

export default GroupDetail;
