import { Config } from "@/constants/Config"


type API = {
    // '/login': {
    //     message: string,
    //     jwt: string,
    //     username: string,
    //     email: string,
    //     role: 'admin' | 'defaut',
    //     id:number,
    // },
    '/login': {
        message: string,
        jwt: string,
        user_info: {
            id: number,
            first_name : string,
            last_name:string
            username: string,
            email: string,
            role: 'admin' | 'default',
        }
    },
    // '/users/[id]' : {
    //     username: string,
    //     email: string,
    //     role: 'admin' | 'defaut',
    //     id:number,
    // }
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