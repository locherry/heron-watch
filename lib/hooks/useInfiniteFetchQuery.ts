import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { ApiPath, ApiPathMethod, ApiRequestBody, ApiRequestParams, PaginatedApiResponse } from "~/@types/api";
import { devEnvConfig } from "~/devEnvConfig.env";
import { SecureStorage } from "../classes/SecureStorage";


const endpoint = "http://" + devEnvConfig["ip"];
const guestRoutes: ApiPath[] = ["/login"];

export function useInfiniteFetchQuery<
  P extends ApiPath,
  M extends ApiPathMethod<P>
>(
  url: P & (PaginatedApiResponse<P, M> extends { data?: unknown[] } ? unknown : never),
  method: M,
  params: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
) {
  const httpMethod = String(method).toUpperCase();
  if (typeof params?.query?.limit !== "number"){
    throw new Error("limit should be a number");
  }
  const limit:number = params?.query?.limit ?? 0;

  // Prepare URL for first page
  const firstPageUrl = adaptURL(endpoint + url, httpMethod, 0, params);

  const queryKey = [url, method, params, body] as const;

  return useInfiniteQuery<
    PaginatedApiResponse<P, M>,                        // TQueryFnData: one page's data
    Error,                                             // TError
    InfiniteData<PaginatedApiResponse<P, M>>,          // TData: all pages
    typeof queryKey,                                   // TQueryKey
    string                                             // TPageParam
  >({
    queryKey,
    initialPageParam: firstPageUrl,
    queryFn: async ({ pageParam }): Promise<PaginatedApiResponse<P, M>> => {
      let headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (!guestRoutes.includes(url)) {
        const jwt = await SecureStorage.get("userSession").then(
          (userSession) => userSession?.jwt
        );
        if (!jwt) {
          throw new Error("JWT token is missing");
        }
        headers = { ...headers, Authorization: "Bearer " + jwt };
      }

      const response = await fetch(pageParam, {
        method: httpMethod,
        headers,
        body: httpMethod !== "GET" && body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: enabled && (httpMethod === "GET" || body !== undefined),
    getNextPageParam: (lastPage, allPages) => {
      if ((lastPage.data?.length ?? 0) < limit) {
        return null;
      }
      return adaptURL(endpoint + url, httpMethod, allPages.length * limit, params);
    },
  });
}

// Helper to insert params into URL
export function adaptURL<P extends ApiPath, M extends ApiPathMethod<P>>(
  full_url: string,
  httpMethod: string,
  offset: number,
  params: ApiRequestParams<P, M>
) {
  const queryParams = {
    ...params.query,
    offset,
  };

  if (params && "path" in params && params.path) {
    for (const [key, value] of Object.entries(params.path)) {
      full_url = full_url.replace(
        `{${key}}`,
        encodeURIComponent(String(value))
      );
    }
  }

  if (httpMethod === "GET") {
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce<Record<string, string>>(
        (acc, [k, v]) => {
          if (v !== undefined && v !== null) acc[k] = String(v);
          return acc;
        },
        {}
      )
    ).toString();

    if (queryString) {
      full_url += `?${queryString}`;
    }
  }

  return full_url;
}