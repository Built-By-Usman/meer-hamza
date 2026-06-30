export class ApiError extends Error {
  status: number;
  info: any;

  constructor(message: string, status: number, info?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

const getBaseUrl = (): string => {
  // 1. Explicit env variable always wins (local dev or CI)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // 2. On the client side, detect production domain and use the real backend
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'timelessbymeer.com' || host === 'www.timelessbymeer.com') {
      return 'https://backend.timelessbymeer.com';
    }
  }
  // 3. Local development fallback
  return 'http://localhost:8000';
};


interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  
  // Format query parameters if provided
  let queryString = '';
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const formattedParams = searchParams.toString();
    if (formattedParams) {
      queryString = `?${formattedParams}`;
    }
  }

  const BASE_URL = getBaseUrl();
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${queryString}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include',
    ...customConfig,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorInfo: any = null;
    try {
      errorInfo = await response.json();
    } catch {
      // Response was not JSON
    }
    
    throw new ApiError(
      errorInfo?.message || errorInfo?.detail || `HTTP error! Status: ${response.status}`,
      response.status,
      errorInfo
    );
  }

  // Handle empty or NO_CONTENT responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
