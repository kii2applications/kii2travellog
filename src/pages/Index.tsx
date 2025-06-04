
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { Header } from '@/components/Header';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { FlightForm } from '@/components/FlightForm';
import { FlightList } from '@/components/FlightList';
import { CountryStats } from '@/components/CountryStats';
import { ExcelImport } from '@/components/ExcelImport';
import { PWAInstallButton } from '@/components/PWAInstallButton';

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date(new Date().getFullYear(), 11, 31), // End of current year
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* PWA Install Button - Mobile optimized */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-end">
          <PWAInstallButton />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
            <FlightForm />
            <ExcelImport />
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            <CountryStats dateRange={dateRange} />
          </div>
        </div>

        {/* Flight List - Full width on mobile, responsive */}
        <div className="w-full">
          <FlightList />
        </div>
      </div>
    </div>
  );
};

export default Index;
