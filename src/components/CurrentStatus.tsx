import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Plane } from 'lucide-react';
import { useFlights } from '@/hooks/useFlights';
import { differenceInDays, format } from 'date-fns';

export const CurrentStatus: React.FC = () => {
  const { flights, isLoading } = useFlights();

  const currentStatus = useMemo(() => {
    if (!flights || flights.length === 0) {
      return null;
    }

    // Sort flights by arrival date to find the most recent arrival
    const sortedFlights = flights
      .filter(flight => new Date(flight.arrival_date) <= new Date())
      .sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

    if (sortedFlights.length === 0) {
      return null;
    }

    const latestFlight = sortedFlights[0];
    const daysSinceArrival = differenceInDays(new Date(), new Date(latestFlight.arrival_date));
    
    // Check if there's a future departure from this country
    const futureDepartures = flights
      .filter(flight => 
        flight.departure_country === latestFlight.arrival_country &&
        new Date(flight.departure_date) > new Date()
      )
      .sort((a, b) => new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime());

    const nextDeparture = futureDepartures.length > 0 ? futureDepartures[0] : null;

    return {
      currentCountry: latestFlight.arrival_country,
      daysSinceArrival,
      arrivalDate: latestFlight.arrival_date,
      nextDeparture
    };
  }, [flights]);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-apple-text">
            <MapPin className="h-5 w-5 text-apple-blue" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-apple-text-secondary">
            Loading status...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStatus) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-apple-text">
            <MapPin className="h-5 w-5 text-apple-blue" />
            Current Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-apple-text-secondary">
            <Plane className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent flights found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-apple-text">
          <MapPin className="h-5 w-5 text-apple-blue" />
          Current Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-apple-text mb-1">
            {currentStatus.currentCountry}
          </div>
          <div className="text-sm text-apple-text-secondary">
            Current location
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-4 w-4 text-apple-text-secondary" />
          <span className="text-apple-text-secondary">
            {currentStatus.daysSinceArrival} {currentStatus.daysSinceArrival === 1 ? 'day' : 'days'} since arrival
          </span>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="border-apple-border text-apple-text-secondary">
            Arrived {format(new Date(currentStatus.arrivalDate), 'MMM d, yyyy')}
          </Badge>
        </div>

        {currentStatus.nextDeparture && (
          <div className="pt-2 border-t border-apple-border/20">
            <div className="text-center text-sm text-apple-text-secondary">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Plane className="h-4 w-4" />
                <span>Next departure</span>
              </div>
              <div className="font-medium text-apple-text">
                {format(new Date(currentStatus.nextDeparture.departure_date), 'MMM d, yyyy')}
              </div>
              <div className="text-xs">
                to {currentStatus.nextDeparture.arrival_country}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};