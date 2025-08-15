/**
 * /!\ Do not use this alone, this is meant to be used 
 * only with tanstack query hooks (eg. useQuery)
 */

import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  ApiResponse,
} from "~/@types/api";
import { devEnvConfig } from "~/devEnvConfig.env";
import { SecureStorage } from "./classes/SecureStorage";

// Base URL for API requests
const endpoint = `http://${devEnvConfig.ip}`;

// List of API routes that do not require JWT authentication
// Due to limitation in openapi-typescript
// (security schemes not transfered from the yaml file)
const guestRoutes: readonly ApiPath[] = ["/login"];

// Returns headers for API requests, adding JWT if needed
async function getAuthHeaders(
  url: string,
  guestRoutes: readonly string[]
): Promise<HeadersInit> {
  let headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  // Add Authorization header if the route is not a guest route
  if (!guestRoutes.includes(url)) {
    const { jwt } = (await SecureStorage.get("userSession")) || {};
    if (!jwt) throw new Error("JWT token is missing");
    headers.Authorization = `Bearer ${jwt}`;
  }

  return headers;
}

// Replaces path parameters like /users/{id} with actual values
function substitutePath(
  url: string,
  pathParams?: Record<string, string | number>
) {
  if (pathParams) {
    for (const [key, value] of Object.entries(pathParams)) {
      url = url.replace(`{${key}}`, encodeURIComponent(String(value)));
    }
  }
  return url;
}

// Converts query parameters object into query string
function buildQueryString(queryParams?: Record<string, any>) {
  if (!queryParams) return "";
  const qs = new URLSearchParams(
    Object.entries(queryParams)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)])
  ).toString();
  return qs ? `?${qs}` : "";
}
/**
 * Generic API fetch function with JWT & type safety from OpenAPI schema
 * @template P Path key from OpenAPI
 * @template M HTTP method for the path
 */
export async function apiFetch<P extends ApiPath, M extends ApiPathMethod<P>>(
  url: P,
  method: M,
  params?: ApiRequestParams<P, M>,
  body?: ApiRequestBody<P, M>
): Promise<ApiResponse<P, M>> {
  const httpMethod = method.toUpperCase() as Uppercase<M>;
  let fullUrl = endpoint + substitutePath(url, params?.path);

  if (httpMethod === "GET") {
    fullUrl += buildQueryString(params?.query);
  }

  const headers = await getAuthHeaders(url, guestRoutes);

  const response = await fetch(fullUrl, {
    method: httpMethod,
    headers,
    body: httpMethod !== "GET" && body ? JSON.stringify(body) : undefined,
  });

  // attempt to parse JSON error if request fails
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}
