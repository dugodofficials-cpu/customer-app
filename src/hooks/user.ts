import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Countdown, User, getCountdown, updateUser } from '@/lib/api/user';

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: Partial<User>) => updateUser(params._id || '', params),
    onSuccess: (response) => {
      queryClient.setQueryData(['auth'], (oldData: { data: User } | undefined) => ({
        ...oldData,
        data: {
          ...oldData?.data,
          ...response.data,
        },
      }));
    },
  });
}

export function useUser() {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData<{ data: User }>(['auth'])?.data;

  const updateUserMutation = useUpdateUser();

  return {
    user: currentUser,
    updateUser: {
      mutate: updateUserMutation.mutate,
      mutateAsync: updateUserMutation.mutateAsync,
      isLoading: updateUserMutation.isPending,
      error: updateUserMutation.error,
      isSuccess: updateUserMutation.isSuccess,
    },
  };
}

export function useCountdown() {
  return useQuery<{ data: Countdown }>({
    queryKey: ['countdown'],
    queryFn: getCountdown,
  });
}
