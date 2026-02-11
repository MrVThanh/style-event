/* eslint-disable @typescript-eslint/ban-ts-comment */
import queryString from "query-string";

/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomOptions = RequestInit & {
  baseUrl?: string;
  lang?: string;
  searchParams?: queryString.StringifiableRecord | undefined;
  responseType?: "json" | "blob";
};

export type ActionResponse<TData = undefined> =
  | (TData extends undefined
      ? { isSuccess: true }
      : { isSuccess: true; data: TData })
  | ServerActionError;

export type ApiResponse<TData = undefined> =
  | (TData extends undefined
      ? { status_code: number; message: string }
      : { status_code: number; data: TData; message: string })
  | ServerActionError;

export type ServerActionError = {
  status_code: number;
  error: string;
  message?: string;
};

export function handleServerError(error: unknown) {
  return {
    error: error instanceof Error ? error.message : "Something went wrong",
    status_code: 500,
  };
}

export function isApiError(res: any): res is ServerActionError {
  return "status_code" in res && "error" in res;
}

const request = async <TData = undefined>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options?: CustomOptions,
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  const isFormData = options?.body instanceof FormData;

  const baseHeaders: Record<string, string> = {
    "Accept-Language": "",
  };

  // Only set Content-Type for non-FormData requests
  // FormData requests should let the browser set Content-Type with boundary
  if (!isFormData) {
    baseHeaders["Content-Type"] = "application/json";
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? process.env.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fetchUrl =
    baseUrl +
    queryString.stringifyUrl(
      {
        url: url,
        query: options?.searchParams,
      },
      { skipNull: true, skipEmptyString: true },
    );

  const res = await fetch(fetchUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
    credentials: "include",
  });

  const payload = (await res.json()) as ApiResponse<TData>;

  if (process.env.NEXT_PUBLIC_LOG_FETCH !== "false")
    console.log({
      url: fetchUrl,
      headers: {
        "ngrok-skip-browser-warning": "true",
        ...baseHeaders,
        ...options?.headers,
      },
      body: body ? (body instanceof FormData ? body : JSON.parse(body)) : null,
      payload: payload,
    });

  return payload;
};

export const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("GET", url, options);
  },
  getWithBody<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("GET", url, { ...options, body });
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<Response>("PUT", url, { ...options, body });
  },
  patch<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("PATCH", url, { ...options, body });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("DELETE", url, { ...options });
  },
  deleteWithBody<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
  multiDelete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">,
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};
