import { apiClient } from './client';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface UserResponse {
  data: User;
  message: string;
}

export const updateUser = async (id: string, params: Partial<User>): Promise<UserResponse> => {
  const { _id, ...rest } = params;
  return apiClient<UserResponse>(`users/${id || _id}`, {
    method: 'PUT',
    body: rest,
  });
};

export interface Countdown {
  id: string;
  title: string;
  description?: string;
  launchDate: string;
  status: string;
  isActive: boolean;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  showDays: boolean;
  showHours: boolean;
  showMinutes: boolean;
  showSeconds: boolean;
  timezone?: string;
  customMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export const getCountdown = async (): Promise<{ data: Countdown }> => {
  return apiClient(`countdown/active`, {
    method: 'GET',
  });
};
