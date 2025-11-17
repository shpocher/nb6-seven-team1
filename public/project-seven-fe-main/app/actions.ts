'use server';

import { getGroups } from '@/lib/api';
import { PaginationQuery } from '@/types/pagination';

export const getGroupsAction = async (paginationQuery: PaginationQuery) => {
  return getGroups(paginationQuery);
};
