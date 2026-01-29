import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBlackboxQuestions,
  getBlackboxQuestionById,
  createBlackboxQuestion,
  updateBlackboxQuestion,
  deleteBlackboxQuestion,
  reorderBlackboxQuestions,
  answerBlackboxQuestion,
  getUserBlackboxProgress,
  getAnsweredBlackboxQuestions,
  getNextUnansweredQuestion,
  GetQuestionsParams,
  CreateQuestionDto,
  UpdateQuestionDto,
  AnswerQuestionDto,
  resetBlackboxProgress,
} from '../lib/api/blackbox';
import { enqueueSnackbar } from 'notistack';

export function useBlackboxQuestions(params: GetQuestionsParams = {}) {
  return useQuery({
    queryKey: ['blackbox-questions', params],
    queryFn: () => getBlackboxQuestions(params),
  });
}

export function useBlackboxQuestion(id: string) {
  return useQuery({
    queryKey: ['blackbox-questions', id],
    queryFn: () => getBlackboxQuestionById(id),
    enabled: !!id,
  });
}

export function useCreateBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => createBlackboxQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-questions'] });
      enqueueSnackbar('Question created successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to create question', {
        variant: 'error',
      });
    },
  });
}

export function useUpdateBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      updateBlackboxQuestion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-questions'] });
      queryClient.invalidateQueries({ queryKey: ['blackbox-questions', variables.id] });
      enqueueSnackbar('Question updated successfully', {
        variant: 'success',
      });
    },
  });
}

export function useDeleteBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlackboxQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-questions'] });
      enqueueSnackbar('Question deleted successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to delete question', {
        variant: 'error',
      });
    },
  });
}

export function useReorderBlackboxQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderBlackboxQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-questions'] });
      enqueueSnackbar('Questions reordered successfully', {
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to reorder questions', {
        variant: 'error',
      });
    },
  });
}

export function useAnswerBlackboxQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnswerQuestionDto) => answerBlackboxQuestion(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-progress'] });
      queryClient.invalidateQueries({ queryKey: ['blackbox-answered'] });
      queryClient.invalidateQueries({ queryKey: ['blackbox-next-question'] });
      queryClient.setQueryData(['blackbox-answer'], data.data);
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to submit answer', {
        variant: 'error',
      });
    },
  });
}

export function useUserBlackboxProgress() {
  return useQuery({
    queryKey: ['blackbox-progress'],
    queryFn: getUserBlackboxProgress,
  });
}

export function useAnsweredBlackboxQuestions() {
  return useQuery({
    queryKey: ['blackbox-answered'],
    queryFn: getAnsweredBlackboxQuestions,
  });
}

export function useNextUnansweredQuestion() {
  return useQuery({
    queryKey: ['blackbox-next-question'],
    queryFn: getNextUnansweredQuestion,
  });
}

export function useResetBlackboxProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetBlackboxProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blackbox-progress'] });
      queryClient.invalidateQueries({ queryKey: ['blackbox-answered'] });
      queryClient.invalidateQueries({ queryKey: ['blackbox-next-question'] });
      enqueueSnackbar('Game reset successfully', { variant: 'success' });
    },
    onError: (error: Error) => {
      enqueueSnackbar(error.message || 'Failed to reset game', {
        variant: 'error',
      });
    },
  });
}
