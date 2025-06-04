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
  
  if (!flights || flights.length === 0) {
    return countryDays;
  }

  // Sort flights by departure date
  const sortedFlights = [...flights].sort((a, b) => 
    new Date(a.departure_date).getTime() - new Date(b.departure_date).getTime()
  );

  console.log('Calculating days for date range:', { startDate, endDate });
  console.log('Sorted flights:', sortedFlights);

  // Track current location and date
  let currentCountry: string | null = null;
  let currentDate = new Date(startDate);

  // If we have flights, assume we start in the departure country of the first flight
  // or the country we were in before the first flight in our date range
  const firstFlightInRange = sortedFlights.find(f => new Date(f.departure_date) >= startDate);
  if (firstFlightInRange) {
    currentCountry = firstFlightInRange.departure_country;
  }

  for (const flight of sortedFlights) {
    const flightDeparture = new Date(flight.departure_date);
    const flightArrival = new Date(flight.arrival_date);

    console.log('Processing flight:', {
      from: flight.departure_country,
      to: flight.arrival_country,
      departure: flightDeparture,
      arrival: flightArrival,
      currentCountry,
      currentDate
    });

    // Skip flights that end before our start date
    if (flightArrival < startDate) {
      currentCountry = flight.arrival_country;
      continue;
    }

    // Skip flights that start after our end date
    if (flightDeparture > endDate) {
      break;
    }

    // If flight departs after our current date and within our range
    if (flightDeparture >= currentDate && flightDeparture <= endDate && currentCountry) {
      const daysUntilDeparture = Math.ceil(
        (Math.min(flightDeparture.getTime(), endDate.getTime()) - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntilDeparture > 0) {
        countryDays[currentCountry] = (countryDays[currentCountry] || 0) + daysUntilDeparture;
        console.log(`Added ${daysUntilDeparture} days to ${currentCountry}`);
      }
    }

    // Update current country and date
    if (flightArrival >= startDate) {
      currentCountry = flight.arrival_country;
      currentDate = new Date(Math.max(flightArrival.getTime(), currentDate.getTime()));
    }
  }

  // Count remaining days in final country until end date
  if (currentCountry && currentDate <= endDate) {
    const remainingDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    if (remainingDays > 0) {
      countryDays[currentCountry] = (countryDays[currentCountry] || 0) + remainingDays;
      console.log(`Added ${remainingDays} remaining days to ${currentCountry}`);
    }
  }

  console.log('Final country days:', countryDays);
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

export const calculateDaysByCustomYear = (
  flights: Flight[],
  startDate: Date,
  endDate: Date,
  yearStartMonth: number = 3, // April (0-indexed)
  yearStartDay: number = 1
): Array<{ year: string; countries: { [country: string]: number }; totalDays: number }> => {
  const yearlyData: { [year: string]: { countries: { [country: string]: number }; totalDays: number } } = {};
  
  // Calculate the number of years based on custom year periods
  const getCustomYear = (date: Date): string => {
    const year = date.getFullYear();
    const yearStart = new Date(year, yearStartMonth, yearStartDay);
    
    if (date < yearStart) {
      return `${year - 1}-${year.toString().slice(-2)}`;
    } else {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    }
  };

  const getCustomYearBounds = (yearLabel: string) => {
    const startYear = parseInt(yearLabel.split('-')[0]);
    const yearStart = new Date(startYear, yearStartMonth, yearStartDay);
    const yearEnd = new Date(startYear + 1, yearStartMonth, yearStartDay - 1);
    return { yearStart, yearEnd };
  };

  // Get all custom years in the range
  const firstCustomYear = getCustomYear(startDate);
  const lastCustomYear = getCustomYear(endDate);
  
  // Generate all year labels between first and last
  const firstYear = parseInt(firstCustomYear.split('-')[0]);
  const lastYear = parseInt(lastCustomYear.split('-')[0]);
  
  for (let year = firstYear; year <= lastYear; year++) {
    const yearLabel = `${year}-${(year + 1).toString().slice(-2)}`;
    const { yearStart, yearEnd } = getCustomYearBounds(yearLabel);
    
    const periodStart = new Date(Math.max(yearStart.getTime(), startDate.getTime()));
    const periodEnd = new Date(Math.min(yearEnd.getTime(), endDate.getTime()));
    
    if (periodStart <= periodEnd) {
      const countryDays = calculateDaysInCountry(flights, periodStart, periodEnd);
      const totalDays = getTotalTravelDays(countryDays);
      
      yearlyData[yearLabel] = {
        countries: countryDays,
        totalDays
      };
    }
  }
  
  return Object.entries(yearlyData)
    .map(([year, data]) => ({ year, ...data }))
    .sort((a, b) => a.year.localeCompare(b.year));
};

// Keep the old function for backward compatibility
export const calculateDaysByYear = (
  flights: Flight[],
  startDate: Date,
  endDate: Date
): Array<{ year: number; days: number }> => {
  const yearlyData: { [year: number]: number } = {};
  
  // Get all years in the range
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  for (let year = startYear; year <= endYear; year++) {
    const yearStart = new Date(Math.max(new Date(year, 0, 1).getTime(), startDate.getTime()));
    const yearEnd = new Date(Math.min(new Date(year, 11, 31).getTime(), endDate.getTime()));
    
    const countryDays = calculateDaysInCountry(flights, yearStart, yearEnd);
    yearlyData[year] = getTotalTravelDays(countryDays);
  }
  
  return Object.entries(yearlyData)
    .map(([year, days]) => ({ year: parseInt(year), days }))
    .sort((a, b) => a.year - b.year);
};
