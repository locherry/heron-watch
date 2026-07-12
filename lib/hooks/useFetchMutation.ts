import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  ApiResponse,
} from "~/@types/api";
import { apiFetch } from "~/lib/apiClient";

/**
 * Generic hook to mutate data at an API endpoint using React Query.
 * Uses central apiFetch() for JWT auth, param/body typing, and error handling.
 *
 * @param url - API path (typed from OpenAPI)
 * @param method - HTTP method (typed for that path)
 * @param options - Extra TanStack mutation options (onMutate/onError/onSettled, etc.)
 *
 * @typeParam TContext - Shape returned by `onMutate`, forwarded to `onError`/`onSettled`.
 *   Defaults to `unknown`; pass explicitly when using optimistic updates with rollback state.
 */
export const useFetchMutation = <
  P extends ApiPath,
  M extends ApiPathMethod<P>,
  TContext = unknown,
>(
  url: P,
  method: M,
  options?: Omit<
    UseMutationOptions<
      ApiResponse<P, M>,
      Error,
      {
        params?: ApiRequestParams<P, M>;
        body?: ApiRequestBody<P, M>;
      },
      TContext
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
    },
    TContext
  >({
    mutationFn: ({ params, body }) => apiFetch<P, M>(url, method, params, body),
    ...options,
  });
};
