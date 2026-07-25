export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: import('../models/user.model').User;
}

export interface LoginRequest {
  username: string;
  password: string;
}
