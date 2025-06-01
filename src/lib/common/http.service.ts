import { AccesDeniedError } from "./http.errors";

export class HttpBaseAPI {
    protected privateEndpoint: string;

    constructor(privateEndpoint: string) {
        this.privateEndpoint = privateEndpoint;
    }

    async httpGet<T>(endpointSuffix: string, params?: string, access_token?: string): Promise<T> {      
        const res = await fetch(`${this.privateEndpoint}${endpointSuffix}${params ? `/${params}` : ''}`, {
            cache: 'no-cache',
            headers: !access_token ? { "Content-Type": "application/json", } : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`,
            },
        });

        if (!res.ok) {
            if (res.status === 403) {
                throw new AccesDeniedError("User has no access");
            }
            // throw new Error('Failed to retrieve: ' + endpointSuffix);X
        }
        return res.json();
    }

    async httpGetPublic<T>(endpointSuffix: string, params?: string): Promise<T> {
        return this.httpGet(`${endpointSuffix}`, params);
    }

    async httpPost<T>(endpointSuffix: string, method: string, body?: object, access_token?: string): Promise<T> {
        const res = await fetch(`${this.privateEndpoint}${endpointSuffix}`, {
            method: method,
            headers: !access_token ? { "Content-Type": "application/json", } : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            if (res.status === 403) {
                throw new AccesDeniedError("User has no access");
            }
            // throw new Error(`Failed to post: ${endpointSuffix}`);
        }

        return res.json();
    }

    async httpPostPublic<T>(endpointSuffix: string, method: string, body: object): Promise<T> {
        return this.httpPost(`${endpointSuffix}`, method, body);
    }
}
