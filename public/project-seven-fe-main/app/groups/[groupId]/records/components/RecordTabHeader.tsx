'use client';

import classNames from 'classnames/bind';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/lib/components/Input';
import { LinkButton } from '@/lib/components/Button';
import Dropdown from '@/lib/components/Dropdown';
import styles from './RecordTabHeader.module.css';
import { useCallback } from 'react';

const cx = classNames.bind(styles);

const RecordTabHeader = ({
  groupId,
  recordsTotal,
}: {
  groupId: number;
  recordsTotal: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const orderBy = searchParams.get('orderBy') || 'createdAt';

  const setUrlParams = useCallback(
    ({
      groupId,
      search,
      orderBy,
    }: {
      groupId: number;
      search: string;
      orderBy: string;
    }) => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (orderBy) params.set('orderBy', orderBy);
      router.push(`/groups/${groupId}/records?${params.toString()}`);
    },
    [router]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const nextSearch = formData.get('search') as string;
    setUrlParams({ groupId, search: nextSearch, orderBy });
  };

  const handleOrderBy = (nextOrderBy: string) => {
    setUrlParams({ groupId, search, orderBy: nextOrderBy });
  };

  return (
    <div className={cx('container')}>
      <div className={cx('total')}>총 {recordsTotal}개의 기록</div>
      <form onSubmit={handleSearch}>
        <Input
          className={cx('search')}
          search
          id="search"
          name="search"
          type="text"
          defaultValue={search}
          placeholder="닉네임으로 검색하기 (엔터)"
        />
      </form>

      <Dropdown
        className={cx('orderBy')}
        options={[
          { label: '최신순', value: 'createdAt' },
          { label: '운동 시간', value: 'time' },
        ]}
        value={orderBy}
        onChange={handleOrderBy}
      />
      <LinkButton appearance="minimal" href={`/groups/${groupId}/records/new`}>
        + 기록하기
      </LinkButton>
    </div>
  );
};

export default RecordTabHeader;
