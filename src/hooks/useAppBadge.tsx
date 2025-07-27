import { useEffect } from 'react';
import { useFlights } from './useFlights';
import { useEvents } from './useEvents';

export const useAppBadge = () => {
  const { flights } = useFlights();
  const { events } = useEvents();

  useEffect(() => {
    // Check if Badge API is supported
    if (!('setAppBadge' in navigator)) {
      return;
    }

    const updateBadge = () => {
      // Calculate days in current country
      const now = new Date();
      const sortedFlights = flights
        .filter(flight => new Date(flight.arrival_date) <= now)
        .sort((a, b) => new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime());

      let badgeCount = 0;

      if (sortedFlights.length > 0) {
        const lastArrival = sortedFlights[0];
        const arrivalDate = new Date(lastArrival.arrival_date);
        const daysInCountry = Math.floor((now.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
        badgeCount = daysInCountry;
      }

      // If no recent flights, show days to next event instead
      if (badgeCount === 0 && events.length > 0) {
        const upcomingEvents = events
          .filter(event => new Date(event.event_date) > now)
          .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());

        if (upcomingEvents.length > 0) {
          const nextEvent = upcomingEvents[0];
          const eventDate = new Date(nextEvent.event_date);
          const daysToEvent = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          badgeCount = daysToEvent > 0 ? daysToEvent : 0;
        }
      }

      // Update the badge (max 99 to keep it readable)
      const displayCount = Math.min(badgeCount, 99);
      if (displayCount > 0) {
        navigator.setAppBadge(displayCount);
      } else {
        navigator.clearAppBadge();
      }
    };

    updateBadge();
  }, [flights, events]);

  // Clear badge when app becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && 'clearAppBadge' in navigator) {
        // Optionally clear badge when app is opened
        // navigator.clearAppBadge();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
};
