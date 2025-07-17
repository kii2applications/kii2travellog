
import React from 'react';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { CountryStats } from '@/components/CountryStats';
import { CurrentStatus } from '@/components/CurrentStatus';
import { UpcomingEvent } from '@/components/UpcomingEvent';
import { useUserSettings } from '@/hooks/useUserSettings';

export const HomePage: React.FC = () => {
  const { settings } = useUserSettings();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: new Date(), // End date is today
  });

  // Set the start date based on user settings
  useEffect(() => {
    if (settings) {
      const today = new Date();
      const currentYear = today.getFullYear();
      
      // Check if we're past the custom year start date
      const customYearStart = new Date(
        currentYear, 
        settings.custom_year_start_month - 1, 
        settings.custom_year_start_day
      );
      
      let yearStart;
      if (today >= customYearStart) {
        // We're in the current custom year
        yearStart = customYearStart;
      } else {
        // We're still in the previous custom year
        yearStart = new Date(
          currentYear - 1, 
          settings.custom_year_start_month - 1, 
          settings.custom_year_start_day
        );
      }
      
      setDateRange(prev => ({
        ...prev,
        from: yearStart,
      }));
    } else {
      // Fallback to calendar year start if no settings
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      setDateRange(prev => ({
        ...prev,
        from: startOfYear,
      }));
    }
  }, [settings]);

  return (
    <div className="max-w-md mx-auto bg-apple-background min-h-screen p-4 space-y-6">
      {/* Mobile-first responsive layout */}
      <div className="space-y-6">
        {/* Current Status */}
        <CurrentStatus />
        
        {/* Upcoming Event */}
        <UpcomingEvent />
        
        {/* Date Filter */}
        <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
        
        {/* Stats */}
        {dateRange.from && dateRange.to && (
          <CountryStats dateRange={{ from: dateRange.from, to: dateRange.to }} />
        )}
      </div>
    </div>
  );
};
