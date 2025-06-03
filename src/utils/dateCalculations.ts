
import type { Flight } from '@/hooks/useFlights';

interface CountryDays {
  [country: string]: number;
}

export const calculateDaysInCountry = (
  flights: Flight[],
  startDate: Date,
  endDate: Date
): CountryDays => {
  const countryDays: CountryDays = {};
  
  // Sort flights by departure date
  const sortedFlights = [...flights].sort((a, b) => 
    new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
  );

  // Track current location and date
  let currentCountry: string | null = null;
  let currentDate = new Date(startDate);

  for (const flight of sortedFlights) {
    const flightDeparture = new Date(flight.departure_date);
    const flightArrival = new Date(flight.arrival_date);

    // If this is the first flight or we're starting tracking
    if (currentCountry === null) {
      // If the flight departs after our start date, assume we were in departure country
      if (flightDeparture >= startDate) {
        currentCountry = flight.departure_country;
      }
    }

    // Count days in current country until departure
    if (currentCountry && flightDeparture >= currentDate && flightDeparture <= endDate) {
      const daysUntilDeparture = Math.max(0, 
        Math.ceil((Math.min(flightDeparture.getTime(), endDate.getTime()) - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      
      countryDays[currentCountry] = (countryDays[currentCountry] || 0) + daysUntilDeparture;
      
      // Update current date to departure date
      currentDate = new Date(flightDeparture);
    }

    // Update current country to arrival country
    if (flightArrival <= endDate) {
      currentCountry = flight.arrival_country;
      currentDate = new Date(flightArrival);
    }
  }

  // Count remaining days in final country
  if (currentCountry && currentDate <= endDate) {
    const remainingDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (remainingDays > 0) {
      countryDays[currentCountry] = (countryDays[currentCountry] || 0) + remainingDays;
    }
  }

  return countryDays;
};

export const getTotalTravelDays = (countryDays: CountryDays): number => {
  return Object.values(countryDays).reduce((sum, days) => sum + days, 0);
};

export const getTopCountries = (countryDays: CountryDays, limit: number = 5) => {
  return Object.entries(countryDays)
    .sort(([, daysA], [, daysB]) => daysB - daysA)
    .slice(0, limit)
    .map(([country, days]) => ({ country, days }));
};
