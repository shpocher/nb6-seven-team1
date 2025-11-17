'use server';

import { revalidatePath } from 'next/cache';
import * as api from '@/lib/api';
import {
  GroupCreate,
  GroupDelete,
  GroupJoin,
  GroupUpdate,
} from '@/types/entities';
import handleError from '@/lib/handleError';
import { createGroup } from '@/lib/api';

export const revalidateGroup = async (groupId: number) => {
  await revalidatePath(`/groups/${groupId}/**/page`);
};

export const getGroupAction = async (groupId: number) => {
  return api.getGroup(groupId);
};

export const likeGroupAction = handleError(async (groupId: number) => {
  await api.likeGroup(groupId);
  await revalidateGroup(groupId);
});

export const unlikeGroupAction = handleError(async (groupId: number) => {
  await api.unlikeGroup(groupId);
  await revalidateGroup(groupId);
});

export const deleteGroupAction = handleError(
  async (groupId: number, data: GroupDelete) => {
    await api.deleteGroup(groupId, data);
  }
);

export const joinGroupAction = handleError(
  async (groupId: number, data: GroupJoin) => {
    await api.joinGroup(groupId, data);
    await revalidateGroup(groupId);
  }
);

export const leaveGroupAction = handleError(
  async (groupId: number, data: GroupJoin) => {
    await api.leaveGroup(groupId, data);
    await revalidateGroup(groupId);
  }
);

export const updateGroupAction = handleError(
  async (groupId: number, data: GroupUpdate) => {
    const group = await api.updateGroup(groupId, data);
    await revalidateGroup(groupId);
    return group;
  }
);

export const createGroupAction = handleError(async (data: GroupCreate) => {
  const group = await createGroup(data);
  return group;
});
