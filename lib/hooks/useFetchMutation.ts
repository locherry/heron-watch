import { useMutation } from "@tanstack/react-query";
import { ApiPath, ApiPathMethod, ApiRequestBody, ApiRequestParams, ApiResponse } from "~/@types/api";
import { apiFetch } from "../apiClient";

export const useFetchMutation = <
  P extends ApiPath,
  M extends ApiPathMethod<P>
>(
  url: P,
  method: M
) => {
  // React Query mutation hook
  const { mutate } = useMutation<
    ApiResponse<P, M>,
    Error,
    { pathParams?: Record<string, string | number>; queryParams?: Record<string, any>; body?: ApiRequestBody<P, M> } // mutate variables
  >({
    mutationFn: async ({ pathParams, queryParams, body }) => {
      // Call the centralized apiFetch function
      return apiFetch(url, method, { path: pathParams, query: queryParams } as ApiRequestParams<P, M>, body);
    },
  });

  return { mutate };
};
