import axios, { AxiosError } from 'axios';
import { cookies } from '@/lib/utils/cookies';
import { ROUTES } from '@/util/paths';

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function buildRequestUrl(endpoint: string): string {
  const cleanedEndpoint = endpoint.replace(/^\//, '');
  if (API_BASE_URL) {
    return `${API_BASE_URL.replace(/\/$/, '')}/${cleanedEndpoint}`;
  }
  return `/api/${cleanedEndpoint}`;
}

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = cookies.getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 429) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== ROUTES.ERROR.RATE_LIMIT) {
          window.location.href = ROUTES.ERROR.RATE_LIMIT;
        }
      }
    }
    return Promise.reject(error);
  }
);

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const response = await axiosInstance.request<T>({
    url: buildRequestUrl(endpoint),
    method,
    headers,
    data: body,
  });

  return response.data;
}
