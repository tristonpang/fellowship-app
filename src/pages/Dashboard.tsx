import axios from 'axios';
import { AlertCircle, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Meeting {
  id: string;
  dateTime: string;
  status: 'recommended' | 'confirmed' | 'rejected' | 'cancelled' | 'met';
  mentee: {
    id: string;
    name: string;
    email: string;
  };
}

// const TestMeeting = {
//   id: '1',
//   dateTime: '2021-10-01T10:00:00Z',
//   status: 'recommended',
//   mentee: {
//     id: '1',
//     name: 'John Doe',
//     email: 'johndoe@gmail.com'
//   }
// }

export function Dashboard() {
  const { data: meetings, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const response = await axios.get('/api/meetings/recommendations');
      return response.data as Meeting[];
    },
  });

  // const meetings = [TestMeeting];

  const handleStatusUpdate = async (meetingId: string, status: Meeting['status']) => {
    await axios.patch(`/api/meetings/${meetingId}`, { status });
  };

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'met':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Mentee Meetings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your upcoming meetings and recommendations
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Mentee
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Recommended Date
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {meetings?.map((meeting) => (
                    <tr key={meeting.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">{meeting.mentee.name}</div>
                        <div className="text-gray-500">{meeting.mentee.email}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(meeting.dateTime).toLocaleDateString()}
                          <Clock className="ml-4 mr-2 h-4 w-4" />
                          {new Date(meeting.dateTime).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {getStatusIcon(meeting.status)}
                          <span className="ml-2 capitalize">{meeting.status}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {meeting.status === 'recommended' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(meeting.id, 'confirmed')}
                              className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-sm font-medium text-green-700 hover:bg-green-100"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(meeting.id, 'rejected')}
                              className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {meeting.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusUpdate(meeting.id, 'cancelled')}
                            className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-sm font-medium text-yellow-700 hover:bg-yellow-100"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}