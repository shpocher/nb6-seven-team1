import Image from 'next/image';
import classNames from 'classnames/bind';
import { PaginationQuery } from '@/types/pagination';
import heroImage from '@/public/assets/hero.png';
import { DEFAULT_GROUPS_PAGINATION_QUERY } from '@/lib/api';
import GroupList from './components/GroupList';
import styles from './page.module.css';
import { getGroupsAction } from './actions';

const cx = classNames.bind(styles);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<PaginationQuery>;
}) {
  const { search = '', orderBy = 'createdAt' } = await searchParams;

  const initialQuery = {
    ...DEFAULT_GROUPS_PAGINATION_QUERY,
    search,
    orderBy,
  };

  const { data: groups, total } = await getGroupsAction(initialQuery);

  return (
    <div className={cx('page')}>
      <h1 className={cx('heading')}>
        기록 기반의
        <br />
        운동 커뮤니티, 세븐
      </h1>
      <Image
        className={cx('hero')}
        src={heroImage}
        alt="hero"
        width={1440}
        height={307}
      />
      <GroupList
        initialQuery={initialQuery}
        initialValues={groups}
        total={total}
      />
    </div>
  );
}
