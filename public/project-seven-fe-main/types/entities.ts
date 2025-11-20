export enum BadgeType {
  PARTICIPATION_10 = 'PARTICIPATION_10',
  RECORD_100 = 'RECORD_100',
  LIKE_100 = 'LIKE_100',
}

export enum ExerciseType {
  RUN = 'run',
  BIKE = 'bike',
  SWIM = 'swim',
}

export enum RankDuration {
  MONTHLY = 'monthly',
  WEEKLY = 'weekly',
}

interface BaseEntity {
  id: number;
  createdAt: number;
  updatedAt: number;
}

export interface Participant extends BaseEntity {
  nickname: string;
}

export interface Group extends BaseEntity {
  name: string;
  description?: string;
  photoUrl?: string | null;
  goalRep: number;
  discordWebhookUrl?: string;
  discordInviteUrl?: string | null;
  likeCount: number;
  tags: string[];
  owner: Participant;
  participants: Participant[];
  badges: BadgeType[];
  recordCount: number;
}

export interface GroupCreate {
  name: string;
  description?: string;
  photoUrl?: string | null;
  goalRep: number;
  discordWebhookUrl?: string;
  discordInviteUrl?: string | null;
  tags: string[];
  ownerNickname: string;
  ownerPassword: string;
}

export type GroupUpdate = Partial<GroupCreate> & {
  ownerPassword: string;
};

export interface GroupDelete {
  ownerPassword: string;
}

export interface GroupJoin {
  nickname: string;
  password: string;
}

export interface Record extends BaseEntity {
  exerciseType: ExerciseType;
  description: string | null;
  time: number;
  distance: number;
  photos: string[];
  author: Participant;
}

export interface RecordCreate {
  exerciseType: ExerciseType;
  description: string;
  time: number;
  distance: number;
  photos: string[];
  authorNickname: string;
  authorPassword: string;
}

export interface Rank {
  participantId: number;
  nickname: string;
  recordCount: number;
  recordTime: number;
}

export const EXERCISE_TYPE_MAP = {
  [ExerciseType.RUN]: '러닝',
  [ExerciseType.BIKE]: '사이클링',
  [ExerciseType.SWIM]: '수영',
};
