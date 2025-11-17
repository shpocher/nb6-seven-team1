export interface PaginationQuery {
  page: number;
  limit: number;
  order: string;
  orderBy: string;
  search: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
}
