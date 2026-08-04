export interface PaginationParams {
  limit: number;
  cursor?: string;
}

export function parsePagination(req: any, res: any, next: any) {
  const limitStr = req.query.limit as string;
  const cursorStr = req.query.cursor as string;
  
  const limit = limitStr ? parseInt(limitStr, 10) : 50;
  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new Error("Invalid limit. Must be between 1 and 100.");
  }
  
  req.paginationParams = {
    limit,
    cursor: cursorStr || undefined
  };
  
  next();
}
