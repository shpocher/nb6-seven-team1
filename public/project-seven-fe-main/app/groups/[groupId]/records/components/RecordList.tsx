'use client';

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useInView } from 'react-intersection-observer';
import { Record } from '@/types/entities';
import { PaginationQuery } from '@/types/pagination';
import { getRecordsAction } from '../actions';
import styles from './RecordList.module.css';
import RecordListItem from './RecordListItem';

const cx = classNames.bind(styles);

const RecordList = ({
  groupId,
  initialQuery,
  initialValues = [],
  total,
}: {
  groupId: number;
  initialQuery: PaginationQuery;
  initialValues: Record[];
  total: number;
}) => {
  const [records, setRecords] = useState(initialValues);
  const [page, setPage] = useState(initialQuery.page);
  const { ref, inView } = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const hasNext = records.length < total;

  const loadMore = useCallback(async () => {
    if (isLoading || !hasNext) return;
    setIsLoading(true);
    let next: Record[] = [];
    try {
      const result = await getRecordsAction(groupId, {
        ...initialQuery,
        page: page + 1,
      });
      next = result.data;
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }
    setRecords((prev) => [...prev, ...next]);
    setPage(page + 1);
  }, [groupId, initialQuery, page, hasNext, isLoading]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  useEffect(() => {
    setRecords(initialValues);
    setPage(initialQuery.page);
  }, [initialValues, initialQuery.page]);

  return (
    <div className={cx('recordList')}>
      {records.map((record) => (
        <RecordListItem key={record.id} record={record} />
      ))}
      {hasNext && <div ref={ref} />}
    </div>
  );
};

export default RecordList;
