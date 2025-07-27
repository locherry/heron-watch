import { useMutation } from "@tanstack/react-query";
import { devEnvConfig } from "~/devEnvConfig";
import { SecureStorage } from "./SecureStorage";
import { paths } from "./swagger";

type Path = keyof paths;
type PathMethod<T extends Path> = keyof paths[T];

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

export const useApiMutation = <
  P extends Path,
  M extends PathMethod<P>
>(
  url: P,
  method: M
) => {
  const httpMethod = String(method).toUpperCase();
  const endpoint = "http://" + devEnvConfig["ip"];

  const { mutate } = useMutation<
    ResponseType<P, M>,
    Error,
    { pathParams?: Record<string, string | number>; body?: RequestBody<P, M> }
  >({
    mutationFn: async ({ pathParams, body }) => {
      // Fetch JWT and handle async part outside the hook
      const userSession = await SecureStorage.get("userSession");
      const jwt = userSession?.jwt;

      if (!jwt) {
        throw new Error("JWT token is missing");
      }

      let resolvedUrl = url as string;
      if (pathParams) {
        for (const key in pathParams) {
          resolvedUrl = resolvedUrl.replace(
            `{${key}}`,
            encodeURIComponent(String(pathParams[key]))
          );
        }
      }

      const response = await fetch(endpoint + resolvedUrl, {
        method: httpMethod,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
  });

  return { mutate };
};
