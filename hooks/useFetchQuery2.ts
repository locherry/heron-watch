import { tintColors } from "@/constants/Colors"
import { Config } from "@/constants/Config"
import { languageRessources } from "@/translations/i18n"


type API = {
    '/login': {
        // 'POST': {
            message: string,
            jwt: string,
            user_info: {
                id: number,
                first_name: string,
                last_name: string
                username: string,
                email: string,
                role: 'admin' | 'default',
            },
            user_preferences: {
                theme: 'system' | 'dark' | 'light',
                tint_color: typeof tintColors[number]["name"]
                language: keyof typeof languageRessources
            }
        // }
    },
}


type Options = {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    headers?: {},
    body?: any
}

export async function useFetchQuery<K extends keyof API>(
    path: K,
    options: Options
): Promise<API[K]> {
    const endpoint = Config.endpoint
    const response = await fetch(endpoint + path, {
        method: options.method,
        headers: options.headers,
        body: options.method !== "GET" ? JSON.stringify(options.body) : undefined // If method is "GET" no need to send body
    });

    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    return response.json() as Promise<API[K]>;
}