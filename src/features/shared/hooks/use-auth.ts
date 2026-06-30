import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { User } from '@/types';

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR<User>(
    '/auth/me',
    (url: string) => apiClient.get<User>(url),
    {
      shouldRetryOnError: false,
      dedupingInterval: 10000, // Longer deduping for auth info
    }
  );

  return {
    user: data || null,
    isLoading,
    error: error || null,
    isAuthenticated: !!data,
    mutate,
  };
}
