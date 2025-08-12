// /@types/api.d.ts
import { paths } from "~/lib/swagger";

declare global {
  // Extract path keys (endpoint URLs) from swagger paths type
  type ApiPath = keyof paths;

  // Extract HTTP method keys ('get', 'post', etc.) for a given path
  type ApiPathMethod<T extends Path> = keyof paths[T];

  // Extract parameters type (path, query, etc.) for a specific endpoint & method
  type ApiRequestParams<
    P extends Path,
    M extends PathMethod<P>,
  > = paths[P][M] extends { parameters: any }
    ? paths[P][M]["parameters"] & { query: { limit: number; offset?: number } }
    : { query: { limit: number; offset?: number } };

  // Extract request body type (JSON content) for a specific endpoint & method
  type ApiRequestBody<
    P extends Path,
    M extends PathMethod<P>,
  > = paths[P][M] extends {
    requestBody: { content: { "application/json": infer R } };
  }
    ? R
    : undefined;

  // Extract response type (JSON content) from 200 response of endpoint & method
  type ApiResponse<
    P extends Path,
    M extends PathMethod<P>,
  > = paths[P][M] extends {
    responses: { 200: { content: { "application/json": infer R } } };
  }
    ? R
    : undefined;

  type PaginatedApiResponse<
    P extends ApiPath,
    M extends ApiPathMethod<P>,
  > = Extract<ApiResponse<P, M>, { data?: unknown[] }>;
}

export { };

