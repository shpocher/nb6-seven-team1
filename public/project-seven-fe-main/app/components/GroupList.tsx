'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import { useInView } from 'react-intersection-observer';
import { Group } from '@/types/entities';
import { PaginationQuery } from '@/types/pagination';
import { LinkButton } from '@/lib/components/Button';
import Dropdown from '@/lib/components/Dropdown';
import Input from '@/lib/components/Input';
import { DEFAULT_GROUPS_PAGINATION_QUERY } from '@/lib/api';
import GroupListItem from './GroupListItem';
import { getGroupsAction } from '../actions';
import styles from './GroupList.module.css';

const cx = classNames.bind(styles);

const GroupListHeader = ({
  initialQuery = DEFAULT_GROUPS_PAGINATION_QUERY,
}: {
  initialQuery: PaginationQuery;
}) => {
  const router = useRouter();

  const setUrlParams = useCallback(
    ({ search, orderBy }: { search: string; orderBy: string }) => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (orderBy) params.set('orderBy', orderBy);
      router.push(`?${params.toString()}`);
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const search = formData.get('search') as string;
    setUrlParams({ search, orderBy: initialQuery.orderBy });
  };

  const handleOrderBy = (nextOrderby: string) => {
    setUrlParams({ search: initialQuery.search, orderBy: nextOrderby });
  };

  return (
    <div className={cx('listHeader')}>
      <h2 className={cx('title')}>진행 중인 그룹</h2>
      <div className={cx('actions')}>
        <form onSubmit={handleSubmit}>
          <Input
            className={cx('search')}
            name="search"
            id="search"
            search
            placeholder="이름으로 검색하기 (엔터)"
            defaultValue={initialQuery.search}
          />
        </form>

        <Dropdown
          className={cx('orderBy')}
          value={initialQuery.orderBy}
          onChange={handleOrderBy}
          options={[
            { label: '최신순', value: 'createdAt' },
            { label: '참여자 수', value: 'participantCount' },
            { label: '좋아요 수', value: 'likeCount' },
          ]}
        />
        <LinkButton appearance="minimal" href="/groups/new">
          + 새 그룹 만들기
        </LinkButton>
      </div>
    </div>
  );
};

const GroupList = ({
  initialValues = [],
  initialQuery,
  total,
}: {
  initialValues: Group[];
  initialQuery: PaginationQuery;
  total: number;
}) => {
  const [groups, setGroups] = useState<Group[]>(initialValues);
  const [page, setPage] = useState(initialQuery.page);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const hasNext = groups.length < total;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNext) return;
    setIsLoading(true);
    let next: Group[] = [];
    try {
      const res = await getGroupsAction({
        ...initialQuery,
        page: page + 1,
      });
      next = res.data;
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }
    setGroups((prev) => [...prev, ...next]);
    setPage(page + 1);
  }, [initialQuery, page, hasNext, isLoading]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    setGroups(initialValues);
    setPage(initialQuery.page);
  }, [initialValues, initialQuery.page]);

  return (
    <div className={cx('container')}>
      <GroupListHeader initialQuery={initialQuery} />
      <ul className={cx('list')}>
        {groups.map((group) => (
          <li key={group.id}>
            <GroupListItem group={group} />
          </li>
        ))}
      </ul>
      {hasNext && <div ref={ref} />}
    </div>
  );
};

export default GroupList;
