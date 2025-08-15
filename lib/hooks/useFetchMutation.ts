import { useMutation } from "@tanstack/react-query"; // React Query hook for mutations (POST/PUT/DELETE)
import { ApiPath, ApiPathMethod, ApiRequestBody, ApiResponse } from "~/@types/api";
import { devEnvConfig } from "~/devEnvConfig.env"; // Local dev environment config (e.g., IP address)
import { SecureStorage } from "../classes/SecureStorage"; // Secure storage helper (to get JWT)

/**
 * Custom hook to perform mutations (POST, PUT, DELETE, PATCH) with type safety.
 * - Takes a path and method typed by OpenAPI swagger
 * - Accepts optional path parameters and request body for the mutation
 * - Retrieves JWT from secure storage and adds Authorization header
 * - Throws error on missing JWT or HTTP error status
 *
 * @param url - API endpoint path (e.g., "/users/{id}")
 * @param method - HTTP method (e.g., "post", "put")
 * @returns Object with `mutate` function to trigger the mutation
 */
export const useFetchMutation = <
  P extends ApiPath,
  M extends ApiPathMethod<P>
>(
  url: P,
  method: M
) => {
  const httpMethod = String(method).toUpperCase();
  const endpoint = "http://" + devEnvConfig["ip"];

  // React Query mutation hook for performing the HTTP request
  const { mutate } = useMutation<
    ApiResponse<P, M>, // Data type returned by the mutation
    Error,              // Error type
    { pathParams?: Record<string, string | number>; body?: ApiRequestBody<P, M> } // Variables accepted by mutate()
  >({
    // Mutation function that executes the API call
    mutationFn: async ({ pathParams, body }) => {
      // Get user session and JWT token from secure storage
      const userSession = await SecureStorage.get("userSession");
      const jwt = userSession?.jwt;

      // Throw error if JWT token is missing (user not authenticated)
      if (!jwt) {
        throw new Error("JWT token is missing");
      }

      // Replace path parameters in the URL (e.g., /users/{id} -> /users/123)
      let resolvedUrl = url as string;
      if (pathParams) {
        for (const key in pathParams) {
          resolvedUrl = resolvedUrl.replace(
            `{${key}}`,
            encodeURIComponent(String(pathParams[key]))
          );
        }
      }

      // Perform the fetch request with method, headers, and optional JSON body
      const response = await fetch(endpoint + resolvedUrl, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + jwt, // Add auth header
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      // Throw error if HTTP status is not 2xx
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse and return JSON response
      return response.json();
    },
  });

  // Return the mutate function to be called from components
  return { mutate };
};
