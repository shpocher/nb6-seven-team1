'use server';

import { getRanks } from '@/lib/api';
import { RankDuration } from '@/types/entities';

export const getRanksAction = async (
  groupId: number,
  duration: RankDuration
) => {
  return getRanks(groupId, duration);
};
