import { useInfiniteQuery } from "@tanstack/react-query";
import { devEnvConfig } from "~/devEnvConfig";
import { SecureStorage } from "./SecureStorage";
import { paths } from "./swagger";

type Path = keyof paths;
type PathMethod<T extends Path> = keyof paths[T];

type RequestParams<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends { parameters: any }
  ? paths[P][M]["parameters"] & {query : {limit : number}}
  : {query : {limit : number}};

type RequestBody<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  requestBody: { content: { "application/json": infer R } };
}
  ? R
  : undefined;

type ResponseType<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : undefined;

const endpoint = "http://" + devEnvConfig["ip"];

// Since openapi-typescript doesnt support yet security schemes as for august 6 2025 (see : https://github.com/openapi-ts/openapi-typescript/issues/922)
// We need to declare guest routes that do not require authentication
const guestRoutes: Path[] = ["/login"];

export const useInfiniteFetchQuery = <P extends Path, M extends PathMethod<P>>(
  url: P,
  method: M,
  params: RequestParams<P, M>,
  body?: RequestBody<P, M>,
  enabled: boolean = true
) => {
  const httpMethod = String(method).toUpperCase();

  // 1️⃣ Copie mutable pour manipuler l'URL
  let full_url = endpoint + url;
  let limit : number = params?.limit;
  
  //use a function that allows 
  full_url = adaptURL(full_url, httpMethod, 0, params);

  const queryKey = [full_url, httpMethod, params, body] as const;

  return useInfiniteQuery<ResponseType<P, M>, Error, ResponseType<P, M>, typeof queryKey, string>({
    queryKey,
    initialPageParam: full_url,
    queryFn: async ({pageParam}): Promise<ResponseType<P, M>> => {
      let headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (!guestRoutes.includes(url)) {
        // Wait for the JWT token to be resolved before proceeding
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
        headers: headers,
        body: httpMethod !== "GET" && body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    enabled: enabled && (httpMethod === "GET" || body !== undefined),
    getNextPageParam: (lastPage, allPages) => {
      //We transform full_url changing offset and limit
      if ((Array.isArray(lastPage) ? lastPage.length : 0) < limit || typeof lastPage === null) {
        return null
      }
      let base_url = endpoint + url;
      let new_full_url = adaptURL(base_url, httpMethod, allPages.length * limit + limit, params);

      return new_full_url;
    }
  });
};

export function adaptURL<P extends Path, M extends PathMethod<P>>(full_url : string, httpMethod : string, offset: number, params: RequestParams<P,M>) {
  //Add offset to url parametters
  params.query.offset = offset ; 

  // 2️⃣ Remplace les paramètres de chemin {param}
  if (params && "path" in params && params.path) {
    for (const [key, value] of Object.entries(params.path)) {
      full_url = full_url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  // 3️⃣ Construit les query params
  if (httpMethod === "GET" && params && "query" in params && params.query) {
    const queryString = new URLSearchParams(
      Object.entries(params.query).reduce<Record<string, string>>(
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
