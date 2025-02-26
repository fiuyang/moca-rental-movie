import { PagingResponse, WebResponse } from '../interface/web.interface';

export const webResponse = <T>(
  statusCode: number,
  message: string,
  data: T | null = null,
  paging?: PagingResponse,
): WebResponse<T> => {
  return {
    statusCode,
    message,
    data,
    paging,
  };
};
