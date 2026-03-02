import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  ApiResponse,
} from "~/@types/api";
import { apiFetch } from "~/lib/apiClient";

export const useFetchMutation = <P extends ApiPath, M extends ApiPathMethod<P>>(
  url: P,
  method: M,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<P, M>,
      Error,
      {
        params?: ApiRequestParams<P, M>;
        body?: ApiRequestBody<P, M>;
      }
    >,
    "mutationFn"
  >,
) => {
  return useMutation<
    ApiResponse<P, M>,
    Error,
    {
      params?: ApiRequestParams<P, M>;
      body?: ApiRequestBody<P, M>;
    }
  >({
    mutationFn: ({ params, body }) => apiFetch<P, M>(url, method, params, body),
    ...options,
  });
};
