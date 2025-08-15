// /@types/api.d.ts
import { paths } from "~/lib/swagger";

// Extract path keys (endpoint URLs) from swagger paths type
export type ApiPath = keyof paths;

// Extract HTTP method keys ('get', 'post', etc.) for a given path
export type ApiPathMethod<T extends Path> = keyof paths[T];

// Extract parameters type (path, query, etc.) for a specific endpoint & method
export type ApiRequestParams<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends { parameters: infer Params }
  ? Params & {
      path?: Record<string, string | number>;
      query?: Record<string, string | number | boolean | null | undefined>;
      header?: never;
      cookie?: never;
    }
  : {
      path?: Record<string, string | number>;
      query?: Record<string, string | number | boolean | null | undefined>;
      header?: never;
      cookie?: never;
    };

// Extract request body type (JSON content) for a specific endpoint & method
export type ApiRequestBody<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  requestBody: { content: { "application/json": infer R } };
}
  ? R
  : undefined;

// Extract response type (JSON content) from 200 response of endpoint & method
export type ApiResponse<
  P extends Path,
  M extends PathMethod<P>,
> = paths[P][M] extends {
  responses: { 200: { content: { "application/json": infer R } } };
}
  ? R
  : undefined;

export type PaginatedApiResponse<
  P extends ApiPath,
  M extends ApiPathMethod<P>,
> = Extract<ApiResponse<P, M>, { data?: unknown[] }>;
