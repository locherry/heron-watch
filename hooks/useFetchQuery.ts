import { Config } from "@/constants/Config"


type API = {
    '/login': {
        message: string,
        jwt: string,
    }
}

const endpoint = Config.endpoint

type Options = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    headers?: {},
    body?: any
}

export async function useFetchQuery<K extends keyof API>(
    path: K,
    options: Options
): Promise<API[K]> {
    const response = await fetch(endpoint + path, {
        method: options.method,
        headers: options.headers,
        body: options.method !== "GET" ? JSON.stringify(options.body) : undefined // If method is get no need to send body
      });
      
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      
      return response.json() as Promise<API[K]>;
}