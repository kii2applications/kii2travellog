
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Map, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { calculateDaysInCountry, calculateDaysByCustomYear } from '@/utils/dateCalculations';
import { useFlights } from '@/hooks/useFlights';

interface CountryStatsProps {
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

// Generate colors for countries
const getCountryColor = (index: number): string => {
  const colors = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
    '#ec4899', // pink
    '#6366f1', // indigo
    '#14b8a6', // teal
    '#a855f7', // purple
    '#059669', // emerald-600
    '#dc2626', // red-600
    '#7c3aed', // violet-600
  ];
  return colors[index % colors.length];
};

export const CountryStats: React.FC<CountryStatsProps> = ({ dateRange }) => {
  const { flights, isLoading } = useFlights();

  const { countryStats, totalDays, yearlyData, chartConfig } = useMemo(() => {
    if (!flights || !dateRange.from || !dateRange.to) {
      return { countryStats: [], totalDays: 0, yearlyData: [], chartConfig: {} };
    }

    console.log('Date range:', dateRange);
    console.log('Available flights:', flights);

    const stats = calculateDaysInCountry(flights, dateRange.from, dateRange.to);
    // Use custom financial year (April to March)
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
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Map className="h-5 w-5 text-blue-500" />
            Country Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Loading travel statistics...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (countryStats.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Map className="h-5 w-5 text-blue-500" />
            Country Statistics
          </CardTitle>
          <CardDescription className="text-gray-400">
            No travel data available for the selected date range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Select a date range and add some flights to see your travel statistics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Travel Summary
          </CardTitle>
          <CardDescription className="text-gray-400">
            {dateRange.from && dateRange.to && 
              `From ${dateRange.from.toLocaleDateString()} to ${dateRange.to.toLocaleDateString()}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{totalDays}</div>
            <div className="text-sm text-gray-400">Total travel days tracked</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Map className="h-5 w-5 text-blue-500" />
            Days by Country
          </CardTitle>
          <CardDescription className="text-gray-400">
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
                      <span className="font-medium text-white">{country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-gray-800 text-white">
                        {days} {days === 1 ? 'day' : 'days'}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
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
