import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './GroupTab.module.css';

const cx = classNames.bind(styles);

const GroupTab = ({
  className,
  selectedTab,
  groupId,
  children,
}: {
  className?: string;
  selectedTab: 'records' | 'rank';
  groupId: number;
  children: React.ReactNode;
}) => (
  <div className={cx('container', className)}>
    <div className={cx('tabs')}>
      <Link
        className={cx('tab', { active: selectedTab === 'records' })}
        href={`/groups/${groupId}/records`}
      >
        기록 목록
      </Link>
      <Link
        className={cx('tab', { active: selectedTab === 'rank' })}
        href={`/groups/${groupId}/rank`}
      >
        랭킹
      </Link>
    </div>
    <div>{children}</div>
  </div>
);

export default GroupTab;
