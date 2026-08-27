import { Response } from 'express';
import { ApiResponse, PaginatedResponse, PaginationMeta } from '@codeforge/shared';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode = 200,
  requestId?: string,
): Response<ApiResponse<T>> => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...(requestId ? { requestId } : {}),
    },
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  statusCode = 200,
  requestId?: string,
): Response<PaginatedResponse<T>> => {
  const responsePayload: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
    meta: {
      timestamp: new Date().toISOString(),
      ...(requestId ? { requestId } : {}),
    },
  };
  return res.status(statusCode).json(responsePayload);
};
