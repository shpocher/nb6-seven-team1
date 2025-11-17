import GroupEditForm from './components/GroupEditForm';
import { notFound } from 'next/navigation';
import { getGroupAction } from '../../actions';

const GroupEditPage = async ({
  params,
}: {
  params: Promise<{
    groupId: string;
  }>;
}) => {
  const groupId = Number((await params).groupId);
  const group = await getGroupAction(groupId);

  if (!group) {
    return notFound();
  }

  return <GroupEditForm groupId={groupId} group={group} />;
};

export default GroupEditPage;
