/**
 * /!\ Do not use this alone, this is meant to be used
 * only with tanstack query hooks (eg. useQuery)
 */

import { router } from "expo-router";
import { t } from "i18next";
import Toast from "react-native-toast-message";
import {
  ApiPath,
  ApiPathMethod,
  ApiRequestBody,
  ApiRequestParams,
  ApiResponse,
} from "~/@types/api";
import { SecureStorage } from "./classes/SecureStorage";
import { capitalizeFirst } from "./utils";

// Base URL for API requests
const protocol =
  process.env.EXPO_PUBLIC_HTTPS_ENABLED === "true" ? "https" : "http";
const endpoint = `${protocol}://${process.env.EXPO_PUBLIC_SERVER_IP}:${process.env.EXPO_PUBLIC_SERVER_PORT}`;

// List of API routes that do not require JWT authentication
// Due to limitation in openapi-typescript
// (security schemes not transfered from the yaml file)
const guestRoutes: readonly ApiPath[] = ["/api/login"];

// Returns headers for API requests, adding JWT if needed
async function getAuthHeaders(
  url: string,
  guestRoutes: readonly string[],
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
  pathParams?: Record<string, string | number>,
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
      .flatMap(([k, v]) => {
        if (Array.isArray(v)) {
          return v.map((item) => [`${k}[]`, String(item)]);
        } else if (typeof v === "object") {
          return Object.entries(v).map(([attr, val]) => [
            `${k}[${attr}]`,
            String(val),
          ]);
        } else {
          return [[k, String(v)]];
        }
      }),
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
  body?: ApiRequestBody<P, M>,
): Promise<ApiResponse<P, M>> {
  const httpMethod = method.toUpperCase() as Uppercase<M>;

  // Construct full URL with path + query params
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

  if (response.ok) {
    if (response.status === 204) return undefined as ApiResponse<P, M>;
    return response.json();
  }

  // ---- Handle errors ----
  const errorData = await response.json().catch(() => null);
  const errorMessage =
    errorData?.error || `HTTP error! status: ${response.status}`;

  if (response.status === 401) {
    if (errorData?.message === "Invalid or expired token") {
      Toast.show({
        type: "error",
        text1: capitalizeFirst(t("errors.loginExpired")),
        text2: capitalizeFirst(t("errors.redirectToLogin")),
      });

      await SecureStorage.remove("userSession");
      router.replace("/login");
    }
  }

  throw new Error(errorMessage);
}
