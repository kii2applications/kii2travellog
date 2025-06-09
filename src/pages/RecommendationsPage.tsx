
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Target, TrendingUp } from 'lucide-react';
import { useFlights } from '@/hooks/useFlights';
import { useEvents } from '@/hooks/useEvents';
import { useCountryTargets } from '@/hooks/useCountryTargets';
import { format, addDays, isAfter, isBefore } from 'date-fns';

export const RecommendationsPage: React.FC = () => {
  const { flights } = useFlights();
  const { events } = useEvents();
  const { targets } = useCountryTargets();

  const recommendations = useMemo(() => {
    const recs: Array<{
      type: 'event' | 'target' | 'gap';
      title: string;
      description: string;
      country: string;
      suggestedDate?: string;
      priority: 'high' | 'medium' | 'low';
    }> = [];

    // Event-based recommendations
    events.forEach(event => {
      const eventDate = new Date(event.event_date);
      const countryFlights = flights.filter(f => 
        f.arrival_country === event.country || f.departure_country === event.country
      );

      if (countryFlights.length === 0) {
        // No flights to this country yet
        const suggestedArrival = format(addDays(eventDate, -7), 'yyyy-MM-dd');
        recs.push({
          type: 'event',
          title: `Plan travel for ${event.event_name}`,
          description: `Consider arriving a week early to explore ${event.country} before your event`,
          country: event.country,
          suggestedDate: suggestedArrival,
          priority: 'high'
        });
      }
    });

    // Target-based recommendations
    targets.forEach(target => {
      const countryFlights = flights.filter(f => 
        f.arrival_country === target.country || f.departure_country === target.country
      );

      if (countryFlights.length === 0) {
        recs.push({
          type: 'target',
          title: `Visit ${target.country}`,
          description: `You haven't visited ${target.country} yet. Target: ${target.minimum_days} days minimum`,
          country: target.country,
          priority: 'medium'
        });
      } else {
        // Calculate total days spent
        let totalDays = 0;
        countryFlights.forEach(flight => {
          if (flight.arrival_country === target.country) {
            const arrivalDate = new Date(flight.arrival_date);
            const departureDate = new Date(flight.departure_date);
            const days = Math.ceil((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
            totalDays += days;
          }
        });

        if (totalDays < target.minimum_days) {
          const remainingDays = target.minimum_days - totalDays;
          recs.push({
            type: 'target',
            title: `More time needed in ${target.country}`,
            description: `You need ${remainingDays} more days to reach your ${target.minimum_days}-day target`,
            country: target.country,
            priority: 'medium'
          });
        }
      }
    });

    // Sort by priority
    return recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [flights, events, targets]);

  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Recommendations</h1>
          <p className="text-gray-600">
            Personalized travel suggestions based on your events and targets
          </p>
        </div>

        {recommendations.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground">
                  Add some events and country targets in your profile to get personalized travel recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index} className={`border-l-4 ${
                rec.priority === 'high' ? 'border-l-red-500' : 
                rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {rec.type === 'event' ? (
                        <Calendar className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Target className="h-5 w-5 text-purple-500" />
                      )}
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {rec.country}
                        </CardDescription>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {rec.priority} priority
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{rec.description}</p>
                  {rec.suggestedDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Suggested date:</span>
                      <span>{format(new Date(rec.suggestedDate), 'PPP')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
