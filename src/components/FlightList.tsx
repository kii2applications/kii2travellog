
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useFlights } from '@/hooks/useFlights';

export const FlightList = () => {
  const { flights, isLoading, deleteFlight, isDeletingFlight } = useFlights();

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-500" />
            Flight History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Loading your flights...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (flights.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-blue-500" />
            Flight History
          </CardTitle>
          <CardDescription>
            Your logged flights will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Plane className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No flights logged yet. Add your first flight to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-blue-500" />
          Flight History
        </CardTitle>
        <CardDescription>
          Manage your logged flights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flights.map((flight) => (
            <div key={flight.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {flight.departure_country}
                    </Badge>
                    <Plane className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {flight.arrival_country}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Departure: {format(new Date(flight.departure_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Arrival: {format(new Date(flight.arrival_date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteFlight(flight.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={isDeletingFlight}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
