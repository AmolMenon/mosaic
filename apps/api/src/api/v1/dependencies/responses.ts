import { ApiSuccessResponse, CursorPagination } from "../schemas/responses/base";

export function formatSuccessResponse<T>(data: T, pagination?: CursorPagination): ApiSuccessResponse<T> {
  return {
    data,
    pagination
  };
}
