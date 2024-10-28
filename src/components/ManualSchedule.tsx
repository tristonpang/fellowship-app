import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface TimeSlot {
  start: string;
  end: string;
}

interface DaySchedule {
  [key: string]: TimeSlot[];
}

export function ManualSchedule({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState('monday');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>({ start: '09:00', end: '17:00' });

  const { mutate: updateSchedule } = useMutation({
    mutationFn: async (schedule: DaySchedule) => {
      return axios.post(`/api/mentees/${userId}/schedule`, schedule);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });

  const handleAddTimeSlot = () => {
    updateSchedule({
      [selectedDay]: [timeSlot],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
            (day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            )
          )}
        </select>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <input
            type="time"
            value={timeSlot.start}
            onChange={(e) => setTimeSlot({ ...timeSlot, start: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <span>to</span>
          <input
            type="time"
            value={timeSlot.end}
            onChange={(e) => setTimeSlot({ ...timeSlot, end: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <button
          onClick={handleAddTimeSlot}
          className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
        >
          Add Time Slot
        </button>
      </div>
    </div>
  );
}