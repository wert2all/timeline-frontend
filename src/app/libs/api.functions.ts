import { FetchResult } from '@apollo/client';

export function extractApiData<TData = never>(
  result: FetchResult<TData> | null
): TData | null | undefined {
  if (result) {
    if (result.errors) {
      throw new Error(result.errors[result.errors.length - 1].message);
    }
    return result.data;
  }
  return null;
}

export function apiAssertNotNull<TData = never>(
  result: TData | undefined | null,
  errorMsg: string
): TData {
  if (result) {
    return result;
  } else {
    throw new Error(errorMsg);
  }
}
