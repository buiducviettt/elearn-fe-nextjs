import { FULL_BACKEND_API } from "@/constants/common";
import environmentHandler from "@/utils/environmentHandler";

const token = {
    value: "",
}; // token will be assigned after authentication successfully

export const setToken = (_token: string) => {
    token.value = _token;
};

type CustomOptions = Omit<RequestInit, "method"> & {
    baseUrl?: string | undefined;
    params?: Record<string, any>; // for get method
    token?: string; // for call api from server => !require pass token from a server component
};
type TMethod = "GET" | "POST" | "PUT" | "DELETE";

export class HttpError extends Error {
    status: number;
    payload: {
        message: string;
        [key: string]: any;
    };
    constructor({ status, payload }: { status: number; payload: any }) {
        super("Http Error");
        this.status = status;
        this.payload = payload;
    }
}

const request = async <Response>(
    method: TMethod,
    url: string,
    options?: CustomOptions | undefined,
) => {
    let body: FormData | string | undefined = undefined;
    let params;
    if (options?.params) {
        params = Object.fromEntries(
            Object.entries(options.params).filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ([_, value]) => value !== undefined,
            ),
        );
    }

    // if body received from formdata => keep it raw, it's not => stringify it !
    if (options?.body instanceof FormData) {
        body = options.body;
    } else if (options?.body) {
        body = JSON.stringify(options.body);
    }

    const baseHeaders: {
        [key: string]: string;
    } =
        body instanceof FormData
            ? {}
            : {
                  "Content-Type": "application/json",
              };

    // prepare token for client after doing the next step
    if (environmentHandler.isClient()) {
        if (token.value) baseHeaders.Authorization = `Bearer ${token.value}`;
    } else {
        // otherwise prepare token for server
        if (options?.token) {
            baseHeaders.Authorization = `Bearer ${options.token}`;
        }
    }

    // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
    // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server (api-next)

    const baseUrl =
        options?.baseUrl === undefined ? FULL_BACKEND_API : options.baseUrl;

    let fullUrl = url.startsWith("/")
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;
    // append params into url
    if (params) {
        fullUrl += "?" + new URLSearchParams(params).toString();
    }

    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...baseHeaders,
            ...options?.headers,
        } as any,
        body,
        method,
    });
    const payload: Response = await res.json();

    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
        headersObj[key.toLowerCase()] = value;
    });

    const data = {
        status: res.status,
        payload,
        headers: headersObj,
    };

    // INTERCEPTOR START
    if (!res.ok) {
        if (res.status === 401) {
            // handle logout
        }
        throw new HttpError(data);
    }
    return data;
};

export function GET<Response>(
    url: string,
    params?: CustomOptions["params"],
    options?: Omit<CustomOptions, "body" | "params"> | undefined,
) {
    return request<Response>("GET", url, { ...options, params });
}

export function POST<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
) {
    return request<Response>("POST", url, { ...options, body });
}
export function PUT<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined,
) {
    return request<Response>("PUT", url, { ...options, body });
}
export function DELETE<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined,
) {
    return request<Response>("DELETE", url, { ...options });
}
