import { useQuery } from "@tanstack/react-query"; // React Query for data fetching & caching
import { devEnvConfig } from "~/devEnvConfig.env"; // Local dev environment config (e.g., IP address)
import { SecureStorage } from "../classes/SecureStorage"; // Secure storage helper (JWT token access)

// Compose base URL from local dev config IP addressd
const endpoint = "http://" + devEnvConfig["ip"];

// List of API routes that do not require JWT authentication
// Due to limitation in openapi-typescript (security schemes not typed)
const guestRoutes: ApiPath[] = ["/login"];

/**
 * Generic hook to fetch data from an API endpoint using React Query.
 * Supports:
 * - Type-safe URL & method based on swagger spec
 * - URL path and query parameter substitution
 * - JSON request body for non-GET methods
 * - JWT authorization header except for guest routes
 * - Automatic error handling for HTTP errors
 *
 * @param url - API path (e.g., "/users")
 * @param method - HTTP method (e.g., "get", "post")
 * @param params - Optional URL parameters (path variables, query params)
 * @param body - Optional JSON request body (for POST, PUT, PATCH)
 * @param enabled - Enable or disable the query (default: true)
 * @returns React Query result with typed data and error
 */

export const useFetchQuery = <P extends ApiPath, M extends ApiPathMethod<P>>(
  url: P,
  method: M,
  params: ApiRequestParams<P, M>, // always object
  body?: ApiRequestBody<P, M>,
  enabled: boolean = true
) => {
  // Normalize method to uppercase string (e.g., 'GET', 'POST')
  const httpMethod = String(method).toUpperCase();

  // 1️⃣ Mutable copy of full URL starting with base endpoint + path
  let full_url = endpoint + url;

  // 2️⃣ Substitute path parameters in URL (e.g., /users/{id} → /users/123)
  if (params.path) {
    for (const [key, value] of Object.entries(params.path)) {
      full_url = full_url.replace(
        `{${key}}`,
        encodeURIComponent(String(value))
      );
    }
  }

  // 3️⃣ Append query parameters for GET requests, if provided
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

  // Function that performs the actual data fetching
  const fetchData = async (): Promise<ApiResponse<P, M>> => {
    // Set default headers for JSON content
    let headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Add Authorization header with Bearer token unless route is a guest route
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

  // Return a React Query hook for this fetch operation
  return useQuery<ApiResponse<P, M>, Error>({
    queryKey,
    queryFn: fetchData,
    // Enable query only if 'enabled' is true and either method is GET or body is provided
    enabled: enabled && (httpMethod === "GET" || body !== undefined),
  });
};
