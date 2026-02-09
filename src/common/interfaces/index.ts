export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
