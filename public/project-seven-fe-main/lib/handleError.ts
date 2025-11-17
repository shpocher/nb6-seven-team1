/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';

export type ActionResult<T = object> =
  | ActionResultSuccess<T>
  | ActionResultError;

interface ActionResultSuccess<T> {
  status: 200;
  data: T;
}

interface ActionResultError {
  status: 400 | 401 | 404 | 500;
  error: { path?: string; message: string };
}

function handleError<T, U extends any[]>(
  fn: (...args: U) => Promise<T>
): (...args: U) => Promise<ActionResult<T>> {
  return async (...args: U) => {
    try {
      const result = await fn(...args);
      return {
        status: 200,
        data: result,
      } as ActionResultSuccess<T>;
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          status: error.response?.status ?? 500,
          error: error.response?.data,
        } as ActionResultError;
      }
      return {
        status: 500,
        error: { message: '알 수 없는 오류가 발생했습니다.' },
      } as ActionResultError;
    }
  };
}

export default handleError;
