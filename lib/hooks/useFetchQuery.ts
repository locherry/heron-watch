import { useQuery } from "@tanstack/react-query";
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
 */
export const useFetchQuery = <P extends ApiPath, M extends ApiPathMethod<P>>(
  url: P,
  method: M,
  params?: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
) => {
  const isFetchable = String(method).toUpperCase() === "GET" || !!body;

  return useQuery<ApiResponse<P, M>, Error>({
    queryKey: [url, method, params, body] as const,
    // Call the centralized apiFetch function
    queryFn: () => apiFetch<P, M>(url, method, params, body),
    enabled: enabled && isFetchable,
  });
};
