import React from 'react';
import { CalendarSync } from '../components/CalendarSync';
import { ManualSchedule } from '../components/ManualSchedule';

export function Settings() {
  // TODO: Get actual user info from auth context
  const userId = 'current-user-id';
  const userType = 'mentor';

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Calendar Settings</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Sync your calendar or set your availability manually.</p>
          </div>
          <div className="mt-5">
            <CalendarSync userType={userType} userId={userId} />
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900">Manual Schedule</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Set your weekly availability manually.</p>
          </div>
          <div className="mt-5">
            <ManualSchedule userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}