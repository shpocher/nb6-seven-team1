'use client';

import { useRouter } from 'next/navigation';
import GroupForm from '../../components/GroupForm';

const GroupCreateForm = () => {
  const router = useRouter();

  const handleSubmit = async (groupId: number) => {
    router.push(`/groups/${groupId}/records`);
  };

  return <GroupForm type="create" onSubmit={handleSubmit} />;
};

export default GroupCreateForm;
