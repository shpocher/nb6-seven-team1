import { PaginationQuery } from '@/types/pagination';
import GroupDetail from '../components/GroupDetail';
import GroupTab from '../components/GroupTab';
import RecordList from './components/RecordList';
import RecordTabHeader from './components/RecordTabHeader';
import { getGroupAction } from '../../actions';
import { getRecordsAction } from './actions';

const GroupRecordsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ groupId: string }>;
  searchParams: Promise<PaginationQuery>;
}) => {
  const groupId = Number((await params).groupId);
  const group = await getGroupAction(groupId);

  const { orderBy = 'createdAt', search = '' } = await searchParams;
  const paginationQuery: PaginationQuery = {
    page: 1,
    limit: 6,
    order: 'desc',
    orderBy,
    search,
  };

  const { data: records, total: recordsTotal } = await getRecordsAction(
    groupId,
    paginationQuery
  );

  return (
    <>
      <GroupDetail group={group} />
      <GroupTab groupId={groupId} selectedTab="records">
        <RecordTabHeader groupId={groupId} recordsTotal={recordsTotal} />
      </GroupTab>
      <RecordList
        groupId={groupId}
        initialQuery={paginationQuery}
        initialValues={records}
        total={recordsTotal}
      />
    </>
  );
};

export default GroupRecordsPage;
