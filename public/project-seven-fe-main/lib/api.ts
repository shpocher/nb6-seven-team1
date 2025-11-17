import { AxiosError } from 'axios';
import {
  Group,
  GroupCreate,
  GroupDelete,
  GroupJoin,
  GroupUpdate,
  Rank,
  RankDuration,
  Record,
  RecordCreate,
} from '@/types/entities';
import { PaginationQuery, PaginationResponse } from '@/types/pagination';
import { axios } from './axios';

export const DEFAULT_GROUPS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

const logError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response) {
      console.error(
        `[프론트] ${response.config.method?.toUpperCase()} ${response.config.url} ${
          response.status
        }`,
      );
      console.error(response.data);
    }
  }
};

export const getGroups = async (query: PaginationQuery): Promise<PaginationResponse<Group>> => {
  try {
    const response = await axios.get('/groups', {
      params: {
        ...DEFAULT_GROUPS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getGroup = async (groupId: number): Promise<Group> => {
  try {
    const response = await axios.get(`/groups/${groupId}`);
    const group = response.data;
    return group;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createGroup = async (group: GroupCreate): Promise<Group> => {
  try {
    const response = await axios.post('/groups', group);
    const createdGroup = response.data;
    return createdGroup;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const updateGroup = async (groupId: number, group: GroupUpdate): Promise<Group> => {
  try {
    const response = await axios.patch(`/groups/${groupId}`, group);
    const updatedGroup = response.data;
    return updatedGroup;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const deleteGroup = (groupId: number, data: GroupDelete) => {
  return axios.delete(`/groups/${groupId}`, { data }).catch((error) => {
    logError(error);
    throw error;
  });
};

export const joinGroup = async (groupId: number, data: GroupJoin): Promise<void> => {
  try {
    await axios.post(`/groups/${groupId}/participants`, data);
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const leaveGroup = async (groupId: number, data: GroupJoin): Promise<void> => {
  try {
    await axios.delete(`/groups/${groupId}/participants`, {
      data,
    });
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const likeGroup = async (groupId: number): Promise<void> => {
  try {
    await axios.post(`/groups/${groupId}/like`); // like 단수
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const unlikeGroup = async (groupId: number): Promise<void> => {
  try {
    await axios.delete(`/groups/${groupId}/like`); // like 단수
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const DEFAULT_RECORDS_PAGINATION_QUERY: PaginationQuery = {
  page: 1,
  limit: 6,
  order: 'desc',
  orderBy: 'createdAt',
  search: '',
};

export const getRecords = async (
  groupId: number,
  query: PaginationQuery,
): Promise<PaginationResponse<Record>> => {
  try {
    const response = await axios.get(`/groups/${groupId}/records`, {
      params: {
        ...DEFAULT_RECORDS_PAGINATION_QUERY,
        ...query,
      },
    });
    const { data, total } = response.data;
    return { data, total };
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const createRecord = async (groupId: number, record: RecordCreate): Promise<Record> => {
  try {
    const response = await axios.post(`/groups/${groupId}/records`, record);
    const createdRecord = response.data;
    return createdRecord;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const getRanks = async (groupId: number, duration: RankDuration): Promise<Rank[]> => {
  try {
    const response = await axios.get(`/groups/${groupId}/rank`, {
      params: { duration },
    });
    const ranks: Rank[] = response.data;
    return ranks;
  } catch (error) {
    logError(error);
    throw error;
  }
};

export const uploadImage = async (
  files: File[],
): Promise<{
  urls: string[];
}> => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file)); //images 수정
    const response = await axios.postForm('/images', formData);
    const { urls } = response.data;
    return { urls };
  } catch (error) {
    logError(error);
    throw error;
  }
};
