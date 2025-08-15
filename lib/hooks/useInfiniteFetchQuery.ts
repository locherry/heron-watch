import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  PaginatedApiResponse,
} from "~/@types/api";
import { apiFetch } from "../apiClient";

export function useInfiniteFetchQuery<
  P extends ApiPath,
  M extends ApiPathMethod<P>,
>(
  url: P &
    (PaginatedApiResponse<P, M> extends { data?: unknown[] } ? unknown : never),
  method: M,
  params: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
): ReturnType<
  typeof useInfiniteQuery<
    PaginatedApiResponse<P, M>,
    Error,
    InfiniteData<PaginatedApiResponse<P, M>>
  >
> {
  if (typeof params?.query?.limit !== "number") {
    throw new Error("limit should be a number");
  }
  const limit: number = params.query!.limit;

  const queryKey = [url, method, params, body] as const;

  return useInfiniteQuery<
    PaginatedApiResponse<P, M>,
    Error,
    InfiniteData<PaginatedApiResponse<P, M>>,
    typeof queryKey
  >({
    queryKey,
    initialPageParam: 0, // offset for first page
    queryFn: async ({ pageParam = 0 }): Promise<PaginatedApiResponse<P, M>> => {
      // Merge offset into query params
      const queryWithOffset = { ...params.query, offset: pageParam };

      // Call the centralized apiFetch function
      const result = await apiFetch(
        url,
        method,
        { ...params, query: queryWithOffset } as ApiRequestParams<P, M>,
        body
      );
      return result as PaginatedApiResponse<P, M>;
    },
    enabled:
      enabled && (String(method).toUpperCase() === "GET" || body !== undefined),
    getNextPageParam: (lastPage, allPages) => {
      // If returned data length is less than limit, no more pages
      if ((lastPage.data?.length ?? 0) < limit) return null;
      return allPages.length * limit; // next offset
    },
  });
}
