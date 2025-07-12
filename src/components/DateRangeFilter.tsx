
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon } from 'lucide-react';
import { format, parse } from 'date-fns';
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
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-apple-text">
          <CalendarIcon className="h-5 w-5 text-apple-blue" />
          Date Range Filter
        </CardTitle>
        <CardDescription className="text-apple-text-secondary">
          Select a date range to analyze your travel days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-apple-text">From Date</label>
            <Input
              type="date"
              value={fromInput}
              onChange={(e) => handleFromInputChange(e.target.value)}
              className="bg-apple-card-background border-apple-border text-apple-text"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-apple-text">To Date</label>
            <Input
              type="date"
              value={toInput}
              onChange={(e) => handleToInputChange(e.target.value)}
              className="bg-apple-card-background border-apple-border text-apple-text"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const thirtyDaysAgo = new Date(today);
              thirtyDaysAgo.setDate(today.getDate() - 30);
              onDateRangeChange({ from: thirtyDaysAgo, to: today });
            }}
            className="glass-button"
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
            className="glass-button"
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
            className="glass-button"
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
            className="glass-button"
          >
            Last 5 years
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
