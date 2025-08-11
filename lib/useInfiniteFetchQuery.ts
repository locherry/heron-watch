import { useInfiniteQuery } from "@tanstack/react-query";
import { devEnvConfig } from "~/devEnvConfig.env";
import { SecureStorage } from "./SecureStorage";

const endpoint = "http://" + devEnvConfig["ip"];

// Routes that do not require authentication
const guestRoutes: ApiPath[] = ["/login"];

export const useInfiniteFetchQuery = <
  P extends ApiPath,
  M extends ApiPathMethod<P>
>(
  
  // Constrain P so only endpoints with data: [] are allowed
  url: P & (ApiResponse<P, M> extends { data: unknown[] } ? unknown : never),
  method: M,
  params: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
) => {
  const httpMethod = String(method).toUpperCase();

  // 1️⃣ Copie mutable pour manipuler l'URL
  let full_url = endpoint + url;
  let limit : number = params?.query.limit ?? 0;
  
  //use a function that allows 
  full_url = adaptURL(full_url, httpMethod, 0, params);

  const queryKey = [full_url, httpMethod, params, body] as const;

  return useInfiniteQuery<
    ApiResponse<P, M>,
    Error,
    ApiResponse<P, M>,
    typeof queryKey,
    string
  >({
    queryKey,
    initialPageParam: full_url,
    queryFn: async ({ pageParam }): Promise<ApiResponse<P, M>> => {
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
      type PageType = PaginatedApiResponse<P, M>;
      const page = lastPage as PageType;

      if (page.data.length < limit) {
        return null;
      }

      let base_url = endpoint + url;
      return adaptURL(
        base_url,
        httpMethod,
        allPages.length * limit,
        params
      );
    },
  });
};

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
