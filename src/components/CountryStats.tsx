
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { calculateDaysInCountry, calculateDaysByYear } from '@/utils/dateCalculations';
import { useFlights } from '@/hooks/useFlights';

interface CountryStatsProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

const chartConfig = {
  days: {
    label: "Days",
    color: "hsl(var(--chart-1))",
  },
};

export const CountryStats: React.FC<CountryStatsProps> = ({ dateRange }) => {
  const { flights, isLoading } = useFlights();

  const { countryStats, totalDays, yearlyData } = useMemo(() => {
    if (!dateRange.from || !dateRange.to || !flights) {
      return { countryStats: [], totalDays: 0, yearlyData: [] };
    }

    console.log('Date range:', dateRange);
    console.log('Available flights:', flights);

    const stats = calculateDaysInCountry(flights, dateRange.from, dateRange.to);
    const yearly = calculateDaysByYear(flights, dateRange.from, dateRange.to);
    
    const countryStats = Object.entries(stats)
      .map(([country, days]) => ({ country, days }))
      .sort((a, b) => b.days - a.days);

    const totalDays = countryStats.reduce((sum, stat) => sum + stat.days, 0);

    return { countryStats, totalDays, yearlyData: yearly };
  }, [flights, dateRange]);

  if (isLoading) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Country Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Loading travel statistics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (countryStats.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Country Statistics
          </CardTitle>
          <CardDescription>
            No travel data available for the selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a date range and add some flights to see your travel statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Travel Summary
          </CardTitle>
          <CardDescription>
            {dateRange.from && dateRange.to && 
              `From ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalDays}</div>
            <div className="text-sm text-gray-600">Total travel days tracked</div>
          </div>
        </CardContent>
      </Card>

      {yearlyData.length > 1 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Travel Days by Year
            </CardTitle>
            <CardDescription>
              Your travel activity over the years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyData}>
                  <XAxis 
                    dataKey="year" 
                    tickLine={false}
                    axisLine={false}
                    className="text-sm"
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    className="text-sm"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar 
                    dataKey="days" 
                    fill="var(--color-days)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            Days by Country
          </CardTitle>
          <CardDescription>
            Time spent in each country during the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {countryStats.map(({ country, days }, index) => {
              const percentage = totalDays > 0 ? (days / totalDays) * 100 : 0;
              
              return (
                <div key={country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-gray-400'
                      }`} />
                      <span className="font-medium text-gray-900">{country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-100">
                        {days} {days === 1 ? 'day' : 'days'}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-blue-500' :
                        index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
