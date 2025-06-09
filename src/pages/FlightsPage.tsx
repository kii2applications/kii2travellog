
import React from 'react';
import { FlightList } from '@/components/FlightList';

export const FlightsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flight History</h1>
          <p className="text-gray-600">
            View and manage all your recorded flights
          </p>
        </div>

        <FlightList />
      </div>
    </div>
  );
};
