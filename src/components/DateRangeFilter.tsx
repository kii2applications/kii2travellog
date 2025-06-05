
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  dateRange, 
  onDateRangeChange 
}) => {
  const [fromInput, setFromInput] = React.useState(
    dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : ''
  );
  const [toInput, setToInput] = React.useState(
    dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : ''
  );

  const handleFromInputChange = (value: string) => {
    setFromInput(value);
    try {
      const date = parse(value, 'yyyy-MM-dd', new Date());
      if (!isNaN(date.getTime())) {
        onDateRangeChange({ ...dateRange, from: date });
      }
    } catch (error) {
      // Invalid date format, ignore
    }
  };

  const handleToInputChange = (value: string) => {
    setToInput(value);
    try {
      const date = parse(value, 'yyyy-MM-dd', new Date());
      if (!isNaN(date.getTime())) {
        onDateRangeChange({ ...dateRange, to: date });
      }
    } catch (error) {
      // Invalid date format, ignore
    }
  };

  // Update input values when dateRange changes externally
  React.useEffect(() => {
    if (dateRange.from) {
      setFromInput(format(dateRange.from, 'yyyy-MM-dd'));
    }
  }, [dateRange.from]);

  React.useEffect(() => {
    if (dateRange.to) {
      setToInput(format(dateRange.to, 'yyyy-MM-dd'));
    }
  }, [dateRange.to]);

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-purple-500" />
          Date Range Filter
        </CardTitle>
        <CardDescription>
          Select a date range to analyze your travel days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">From Date</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={fromInput}
                onChange={(e) => handleFromInputChange(e.target.value)}
                className="flex-1 bg-white/50"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/50"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={2000}
                    toYear={2030}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To Date</label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={toInput}
                onChange={(e) => handleToInputChange(e.target.value)}
                className="flex-1 bg-white/50"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/50"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={2000}
                    toYear={2030}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const thirtyDaysAgo = new Date(today);
              thirtyDaysAgo.setDate(today.getDate() - 30);
              onDateRangeChange({ from: thirtyDaysAgo, to: today });
            }}
            className="bg-white/50"
          >
            Last 30 days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const oneYearAgo = new Date(today);
              oneYearAgo.setFullYear(today.getFullYear() - 1);
              onDateRangeChange({ from: oneYearAgo, to: today });
            }}
            className="bg-white/50"
          >
            Last year
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const startOfYear = new Date(today.getFullYear(), 0, 1);
              onDateRangeChange({ from: startOfYear, to: today });
            }}
            className="bg-white/50"
          >
            This year
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const fiveYearsAgo = new Date(today);
              fiveYearsAgo.setFullYear(today.getFullYear() - 5);
              onDateRangeChange({ from: fiveYearsAgo, to: today });
            }}
            className="bg-white/50"
          >
            Last 5 years
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
