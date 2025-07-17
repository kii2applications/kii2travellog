import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Plane, Bell } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useFlights } from '@/hooks/useFlights';
import { format, differenceInDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const UpcomingEvent: React.FC = () => {
  const { events, isLoading: eventsLoading } = useEvents();
  const { flights, isLoading: flightsLoading } = useFlights();

  const { upcomingEvent, currentCountry, needsTravel } = useMemo(() => {
    if (!events || events.length === 0 || !flights) {
      return { upcomingEvent: null, currentCountry: null, needsTravel: false };
    }

    // Find next upcoming event
    const futureEvents = events
      .filter(event => new Date(event.event_date) > new Date())
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

    if (futureEvents.length === 0) {
      return { upcomingEvent: null, currentCountry: null, needsTravel: false };
    }

    // Get current location from flights
    const recentArrivals = flights
      .filter(flight => new Date(flight.arrival_date) <= new Date())
      .sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

    const currentCountry = recentArrivals.length > 0 ? recentArrivals[0].arrival_country : null;
    const upcomingEvent = futureEvents[0];
    const needsTravel = currentCountry && currentCountry !== upcomingEvent.country;

    return { upcomingEvent, currentCountry, needsTravel };
  }, [events, flights]);

  const handleScheduleReminder = async () => {
    if (!upcomingEvent) return;

    try {
      const { error } = await supabase.functions.invoke('schedule-travel-reminder', {
        body: {
          eventId: upcomingEvent.id,
          eventDate: upcomingEvent.event_date,
          eventName: upcomingEvent.event_name,
          eventCountry: upcomingEvent.country,
          currentCountry,
          reminderDays: 10 // Default to 10 days before
        }
      });

      if (error) throw error;

      toast({
        title: "Reminder Scheduled",
        description: "You'll receive an email reminder 10 days before your event.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule reminder",
        variant: "destructive",
      });
    }
  };

  if (eventsLoading || flightsLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-apple-text">
            <Calendar className="h-5 w-5 text-apple-green" />
            Upcoming Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-apple-text-secondary">
            Loading events...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!upcomingEvent) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-apple-text">
            <Calendar className="h-5 w-5 text-apple-green" />
            Upcoming Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-apple-text-secondary">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming events</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysUntilEvent = differenceInDays(new Date(upcomingEvent.event_date), new Date());

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-apple-text">
          <Calendar className="h-5 w-5 text-apple-green" />
          Upcoming Event
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-semibold text-apple-text mb-1">
            {upcomingEvent.event_name}
          </div>
          <div className="flex items-center justify-center gap-2 text-apple-text-secondary">
            <MapPin className="h-4 w-4" />
            <span>{upcomingEvent.country}</span>
          </div>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="border-apple-border text-apple-text-secondary">
            {format(new Date(upcomingEvent.event_date), 'MMM d, yyyy')}
          </Badge>
          <div className="text-sm text-apple-text-secondary mt-1">
            in {daysUntilEvent} {daysUntilEvent === 1 ? 'day' : 'days'}
          </div>
        </div>

        {upcomingEvent.description && (
          <div className="text-center text-sm text-apple-text-secondary">
            {upcomingEvent.description}
          </div>
        )}

        {needsTravel && (
          <div className="pt-4 border-t border-apple-border/20 space-y-3">
            <div className="flex items-center justify-center gap-2 text-apple-orange">
              <Plane className="h-4 w-4" />
              <span className="text-sm font-medium">Travel Required</span>
            </div>
            <div className="text-xs text-apple-text-secondary text-center">
              You're currently in {currentCountry}
            </div>
            <Button 
              onClick={handleScheduleReminder}
              size="sm" 
              className="w-full bg-apple-blue hover:bg-apple-blue/90 text-white"
            >
              <Bell className="h-4 w-4 mr-2" />
              Set Travel Reminder
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};