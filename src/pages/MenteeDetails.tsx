import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import axios from 'axios';
import { NotesSection } from '../components/NotesSection';

interface Meeting {
  id: string;
  dateTime: string;
  status: string;
  notes?: string;
}

interface Note {
  id: string;
  content: string;
  type: 'general' | 'prayer';
  isAnswered: boolean;
  createdAt: string;
}

interface Mentee {
  id: string;
  name: string;
  email: string;
  meetings: Meeting[];
  notes: Note[];
}

export function MenteeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: mentee, isLoading } = useQuery({
    queryKey: ['mentee', id],
    queryFn: async () => {
      const response = await axios.get(`/api/mentees/${id}`);
      return response.data as Mentee;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!mentee) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <User className="h-12 w-12 text-gray-400" />
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">{mentee.name}</h2>
              <p className="text-sm text-gray-500">{mentee.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Notes & Prayer Requests</h3>
          <div className="mt-6">
            <NotesSection menteeId={mentee.id} notes={mentee.notes} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Meeting History</h3>
          <div className="mt-6 flow-root">
            <ul className="-mb-8">
              {mentee.meetings.map((meeting, idx) => (
                <li key={meeting.id}>
                  <div className="relative pb-8">
                    {idx !== mentee.meetings.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-gray-500" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            Meeting {meeting.status}
                          </p>
                          {meeting.notes && (
                            <p className="mt-2 text-sm text-gray-500">
                              <FileText className="inline-block h-4 w-4 mr-1" />
                              {meeting.notes}
                            </p>
                          )}
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time dateTime={meeting.dateTime}>
                            {new Date(meeting.dateTime).toLocaleDateString()}
                          </time>
                          <div className="text-xs">
                            {new Date(meeting.dateTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}