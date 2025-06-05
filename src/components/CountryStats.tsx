
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { calculateDaysInCountry, calculateDaysByCustomYear } from '@/utils/dateCalculations';
import { useFlights } from '@/hooks/useFlights';

interface CountryStatsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Generate colors for countries
const getCountryColor = (index: number): string => {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    '#3b82f6', // blue
    '#10b981', // green
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6366f1', // indigo
  ];
  return colors[index % colors.length];
};

export const CountryStats: React.FC<CountryStatsProps> = ({ dateRange }) => {
  const { flights, isLoading } = useFlights();

  const { countryStats, totalDays, yearlyData, chartConfig } = useMemo(() => {
    if (!flights) {
      return { countryStats: [], totalDays: 0, yearlyData: [], chartConfig: {} };
    }

    console.log('Date range:', dateRange);
    console.log('Available flights:', flights);

    const stats = calculateDaysInCountry(flights, dateRange.from, dateRange.to);
    // Use custom financial year (April to March) - you can modify these values
    const yearly = calculateDaysByCustomYear(flights, dateRange.from, dateRange.to, 3, 1); // April 1st
    
    console.log('Yearly data calculated:', yearly);
    
    const countryStats = Object.entries(stats)
      .map(([country, days]) => ({ country, days }))
      .sort((a, b) => b.days - a.days);

    const totalDays = countryStats.reduce((sum, stat) => sum + stat.days, 0);

    // Get all unique countries from yearly data for chart
    const allCountries = new Set<string>();
    yearly.forEach(yearData => {
      Object.keys(yearData.countries).forEach(country => allCountries.add(country));
    });

    // Create chart config with colors for each country
    const chartConfig: any = {};
    Array.from(allCountries).forEach((country, index) => {
      chartConfig[country] = {
        label: country,
        color: getCountryColor(index),
      };
    });

    // Transform yearly data for the chart - ensure we have proper data structure
    const chartData = yearly.map(yearData => {
      const dataPoint: any = { year: yearData.year };
      Array.from(allCountries).forEach(country => {
        dataPoint[country] = yearData.countries[country] || 0;
      });
      return dataPoint;
    });

    console.log('Chart data transformed:', chartData);
    console.log('Chart config:', chartConfig);

    return { countryStats, totalDays, yearlyData: chartData, chartConfig };
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

      {yearlyData.length > 0 && Object.keys(chartConfig).length > 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Travel Days by Custom Year (Apr-Mar)
            </CardTitle>
            <CardDescription>
              Your travel activity by country across custom financial years
            </CardDescription>
          </CardHeader>
          <CardContent>
            {yearlyData.length > 1 ? (
              <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={yearlyData} 
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                  >
                    <XAxis 
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      className="text-sm"
                    />
                    <YAxis 
                      type="category"
                      dataKey="year"
                      tickLine={false}
                      axisLine={false}
                      className="text-sm"
                      width={50}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend />
                    {Object.keys(chartConfig).map((country) => (
                      <Bar
                        key={country}
                        dataKey={country}
                        stackId="countries"
                        fill={chartConfig[country].color}
                        radius={0}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Need data spanning multiple years to show yearly comparison chart</p>
              </div>
            )}
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
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: getCountryColor(index) }} />
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
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: getCountryColor(index)
                      }}
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
