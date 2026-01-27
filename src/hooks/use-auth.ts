import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { cookies } from '@/lib/utils/cookies';
import { ROUTES } from '@/util/paths';

interface User {
  id: string;
  email: string;
  emailVerified: boolean;
}

interface AuthResponse {
  data: User;
  token?: string;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends SignInCredentials {
  name: string;
}

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ['auth'],
    queryFn: () => apiClient<AuthResponse>('auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleAuthSuccess = (response: AuthResponse) => {
    if (response.token) {
      cookies.setAuthToken(response.token);
    }
    queryClient.setQueryData(['auth'], response);
    router.push(ROUTES.USER.HOME);
  };

  const signIn = useMutation({
    mutationFn: (credentials: SignInCredentials) =>
      apiClient<AuthResponse>('auth/signin', {
        method: 'POST',
        body: credentials,
      }),
    onSuccess: handleAuthSuccess,
  });

  const signUp = useMutation({
    mutationFn: (credentials: SignUpCredentials) =>
      apiClient<AuthResponse>('auth/signup', {
        method: 'POST',
        body: credentials,
      }),
    onSuccess: handleAuthSuccess,
  });

  const signOut = useMutation({
    mutationFn: () =>
      apiClient('auth/signout', {
        method: 'POST',
      }),
    onSuccess: () => {
      cookies.removeAuthToken();
      queryClient.setQueryData(['auth'], { user: null });
      router.push(ROUTES.AUTH.SIGN_IN);
    },
  });

  return {
    user: data,
    isAuthenticated: !!data?.data?.email,
    isLoading,
    error,
    signIn: {
      mutate: signIn.mutate,
      isLoading: signIn.isPending,
      error: signIn.error,
    },
    signUp: {
      mutate: signUp.mutate,
      isLoading: signUp.isPending,
      error: signUp.error,
    },
    signOut: {
      mutate: signOut.mutate,
      isLoading: signOut.isPending,
      error: signOut.error,
    },
  };
} 