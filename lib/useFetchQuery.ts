import { useQuery } from "@tanstack/react-query";
import { devEnvConfig } from "~/devEnvConfig.env";
import { SecureStorage } from "./SecureStorage";

const endpoint = "http://" + devEnvConfig["ip"];
const guestRoutes: ApiPath[] = ["/login"];

export const useFetchQuery = <P extends ApiPath, M extends ApiPathMethod<P>>(
  url: P,
  method: M,
  params: ApiRequestParams<P, M>, // always object
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
) => {
  const httpMethod = String(method).toUpperCase();
  let full_url = endpoint + url;

  // Path parameters
  if (params.path) {
    for (const [key, value] of Object.entries(params.path)) {
      full_url = full_url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }

  // Query parameters for GET requests
  if (httpMethod === "GET" && params.query) {
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

  const fetchData = async (): Promise<ApiResponse<P, M>> => {
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

    const response = await fetch(full_url, {
      method: httpMethod,
      headers,
      body: httpMethod !== "GET" && body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const queryKey = [full_url, httpMethod, params, body] as const;

  return useQuery<ApiResponse<P, M>, Error>({
    queryKey,
    queryFn: fetchData,
    enabled: enabled && (httpMethod === "GET" || body !== undefined),
  });
};
