
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/50",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "PPP") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/50",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "PPP") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
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
        </div>
      </CardContent>
    </Card>
  );
};
