export interface PagingResponse {
  limit: number;
  page: number;
  total_data: number;
  total_page: number;
}

export interface WebResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  paging?: PagingResponse;
}