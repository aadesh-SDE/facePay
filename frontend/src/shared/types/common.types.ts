export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type LoadingState = "idle" | "loading" | "succeeded" | "failed";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
