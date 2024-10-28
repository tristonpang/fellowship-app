import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Calendar } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CalendarSyncProps {
  userType: 'mentor' | 'mentee';
  userId: string;
}

export function CalendarSync({ userType, userId }: CalendarSyncProps) {
  const queryClient = useQueryClient();

  const { mutate: syncCalendar } = useMutation({
    mutationFn: async (token: string) => {
      return axios.post(`/api/calendar/sync`, {
        token,
        userType,
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar.readonly',
    onSuccess: (response) => {
      syncCalendar(response.access_token);
    },
  });

  return (
    <button
      onClick={() => login()}
      className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
    >
      <Calendar className="mr-2 h-4 w-4" />
      Sync Calendar
    </button>
  );
}