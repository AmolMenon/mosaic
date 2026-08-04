export interface CursorPagination {
  next_cursor: string | null;
  has_more: boolean;
}

export interface ApiSuccessResponse<T> {
  data: T;
  pagination?: CursorPagination;
}
