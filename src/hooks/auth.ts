import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { SignInInput, SignUpInput } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/util/paths';
import { cookies } from '@/lib/utils/cookies';

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Omit<SignUpInput, 'confirmPassword'>) => authApi.signUp(data),
    onSuccess: (response, data) => {
      if (!response || !response) {
        console.error('Invalid auth response:', response);
        return;
      }

      router.push(ROUTES.AUTH.VERIFY_EMAIL + `?email=${encodeURIComponent(data.email)}`);
    },
  });
}

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInInput) => authApi.signIn(data),
    onSuccess: (response) => {
      if (!response || !response) {
        console.error('Invalid auth response:', response);
        return;
      }

      cookies.setAuthToken(response.data.token);

      queryClient.clear(); // Clear all queries when signing in
      router.push(ROUTES.USER.HOME);
    },
  });
}

export function useGoogleSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { token: string }) => authApi.googleSignUp(data),
    onSuccess: (response) => {
      if (!response || !response) {
        console.error('Invalid auth response:', response);
        return;
      }

      cookies.setAuthToken(response.data.token);
      queryClient.clear();
      router.push(ROUTES.USER.HOME);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
    onSuccess: () => {
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authApi.resendVerification(email),
  });
}

export function useVerifyEmailToken() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmailToken(token),
    onSuccess: (response) => {
      queryClient.clear();
      cookies.setAuthToken(response.data.token);
      router.push(ROUTES.USER.HOME);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authApi.resetPassword(token, password),
    onSuccess: () => {
      setTimeout(() => {
        router.push(ROUTES.AUTH.SIGN_IN);
      }, 3000);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      cookies.removeAuthToken();

      queryClient.clear(); // Clear all queries when logging out
      router.push(ROUTES.AUTH.SIGN_IN);
    },
  });
}
