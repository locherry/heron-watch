import { useQuery } from "@tanstack/react-query";
import { devEnvConfig } from "~/devEnvConfig";
import { SecureStorage } from "./SecureStorage";
import { paths } from "./swagger";

type Path = keyof paths;
type PathMethod<T extends Path> = keyof paths[T];

type RequestParams<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends { parameters: any }
  ? paths[P][M]["parameters"]
  : undefined;

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

export const useFetchQuery = <P extends Path, M extends PathMethod<P>>(
  url: P,
  method: M,
  params?: RequestParams<P, M>,
  body?: RequestBody<P, M>,
  enabled: boolean = true
) => {
  const httpMethod = String(method).toUpperCase();

  const queryString =
    httpMethod === "GET" && params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";

  const full_url = endpoint + url + queryString;

  const fetchData = async (): Promise<ResponseType<P, M>> => {
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
    const response = await fetch(full_url, {
      method: httpMethod,
      headers: headers,
      body: httpMethod !== "GET" && body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const queryKey = [full_url, httpMethod, params, body] as const;

  return useQuery<ResponseType<P, M>, Error>({
    queryKey,
    queryFn: fetchData,
    enabled: enabled && (httpMethod === "GET" || body !== undefined),
  });
};
