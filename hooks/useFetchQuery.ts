import { tintColors } from "@/constants/Colors"
import { Config } from "@/constants/Config"
import { languageRessources } from "@/translations/i18n"


type API = {
    '/login': {
        POST: {
            request: {
                headers?: Record<string, string>
                body: {
                    email: string
                    password: string
                }
            }
            response: {
                body: {
                    message: string,
                    jwt: string
                    user_info: {
                        id: number,
                        first_name: string
                        last_name: string
                        username: string
                        email: string
                        role: 'admin' | 'default'
                    },
                    user_preferences: {
                        theme: 'system' | 'dark' | 'light'
                        tint_color: typeof tintColors[number]["name"]
                        language: keyof typeof languageRessources
                    }
                }
            }
        }
    },
    '/users': {
        GET: {
            response: {
                data: {
                    id: number,
                    first_name: string
                    last_name: string
                    username: string
                    email: string
                    role: 'admin' | 'default'
                }[]
            }
        }
    },
    '/users/[id]': {
        PATCH: {
            request: {
                user_info?: {
                    first_name?: string
                    last_name?: string
                    username?: string
                    email?: string
                    role?: 'admin' | 'default'
                },
                user_preferences?: {
                    theme?: 'system' | 'dark' | 'light'
                    tint_color?: typeof tintColors[number]["name"]
                    language?: keyof typeof languageRessources
                }
            }
        }
        DELETE : {}
    }
}

type APIPaths = keyof API;
type MethodForPath<P extends APIPaths> = keyof API[P];

// Helper types to safely extract request and response types
type RequestType<P extends APIPaths, M extends MethodForPath<P>> =
    API[P][M] extends { request: infer R } ? R : undefined;

type RequestBodyType<P extends APIPaths, M extends MethodForPath<P>> =
    RequestType<P, M> extends { body: infer B } ? B : undefined;

type RequestHeadersType<P extends APIPaths, M extends MethodForPath<P>> =
    RequestType<P, M> extends { headers: infer H } ? H : undefined;

type ResponseType<P extends APIPaths, M extends MethodForPath<P>> =
    API[P][M] extends { response: { body: infer R } } ? R :
    API[P][M] extends { response: infer R } ? R : undefined;

// Main function
export async function useFetchQuery<
    P extends APIPaths,
    M extends MethodForPath<P>
>(
    path: P,
    method: M,
    body?: RequestBodyType<P, M>,
    headers?: RequestHeadersType<P, M>
): Promise<ResponseType<P, M>> {
    const endpoint = Config.endpoint;

    const fetchOptions: RequestInit = {
        method: method as string,
        headers: {
            "Content-Type": "application/json",
            ...(headers || {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    };

    const response = await fetch(endpoint + path, fetchOptions);

    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    // @ts-expect-error: for endpoints without response body
    return {};
}
