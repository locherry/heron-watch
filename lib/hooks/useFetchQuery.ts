import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  ApiResponse,
} from "~/@types/api";
import { apiFetch } from "~/lib/apiClient";

/**
 * Generic hook to fetch data from an API endpoint using React Query.
 * Uses central apiFetch() for:
 *  - JWT authorization (except guest routes)
 *  - Path & query parameter substitution
 *  - Error handling
 *  - Type safety from OpenAPI schema
 *
 * @param url - API path (typed from OpenAPI)
 * @param method - HTTP method (typed for that path)
 * @param params - Optional path/query params
 * @param body - Optional request body (typed for that path & method)
 * @param enabled - Whether to run the query
 * @param options - Extra TanStack query options
 */
export const useFetchQuery = <
  P extends ApiPath,
  M extends ApiPathMethod<P>
>(
  url: P,
  method: M,
  params?: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true,
  options?: Omit<
    UseQueryOptions<ApiResponse<P, M>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  const isFetchable = String(method).toUpperCase() === "GET" || !!body;

  return useQuery<ApiResponse<P, M>, Error>({
    queryKey: [url, method, params, body] as const,
    queryFn: () => apiFetch<P, M>(url, method, params, body),
    enabled: enabled && isFetchable,
    retry: String(method).toUpperCase() === "GET",
    ...options, // allow override
  });
};
