'use client';

import { useRouter } from 'next/navigation';
import GroupForm from '@/app/groups/components/GroupForm';
import { Group } from '@/types/entities';

export default function GroupEditForm({
  groupId,
  group,
}: {
  groupId: number;
  group: Group;
}) {
  const router = useRouter();

  const onSubmit = () => {
    router.push(`/groups/${groupId}/records`);
  };

  return <GroupForm type="update" group={group} onSubmit={onSubmit} />;
}
