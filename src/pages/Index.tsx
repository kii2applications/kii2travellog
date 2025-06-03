
import React, { useState, useMemo } from 'react';
import { FlightForm } from '@/components/FlightForm';
import { CountryStats } from '@/components/CountryStats';
import { DateRangeFilter } from '@/components/DateRangeFilter';
import { FlightList } from '@/components/FlightList';
import { Plane, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Flight {
  id: string;
  departureCountry: string;
  arrivalCountry: string;
  departureDate: string;
  arrivalDate: string;
}

const sampleFlights: Flight[] = [
  {
    id: '1',
    departureCountry: 'United States',
    arrivalCountry: 'France',
    departureDate: '2024-01-15',
    arrivalDate: '2024-01-16'
  },
  {
    id: '2',
    departureCountry: 'France',
    arrivalCountry: 'Germany',
    departureDate: '2024-02-10',
    arrivalDate: '2024-02-10'
  },
  {
    id: '3',
    departureCountry: 'Germany',
    arrivalCountry: 'United States',
    departureDate: '2024-03-05',
    arrivalDate: '2024-03-06'
  }
];

const Index = () => {
  const [flights, setFlights] = useState<Flight[]>(sampleFlights);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 0, 1),
    to: new Date()
  });

  const addFlight = (flight: Omit<Flight, 'id'>) => {
    const newFlight = {
      ...flight,
      id: Date.now().toString()
    };
    setFlights(prev => [...prev, newFlight]);
  };

  const deleteFlight = (id: string) => {
    setFlights(prev => prev.filter(flight => flight.id !== id));
  };

  const totalFlights = flights.length;
  const uniqueCountries = new Set([
    ...flights.map(f => f.departureCountry),
    ...flights.map(f => f.arrivalCountry)
  ]).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Travel Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your international travels and monitor days spent in different countries
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Flights</CardTitle>
              <Plane className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalFlights}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Countries Visited</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{uniqueCountries}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Period</CardTitle>
              <Calendar className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {dateRange.from && dateRange.to 
                  ? Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
                  : 0
                } days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="flights" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Add Flight
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <CountryStats 
              flights={flights}
              dateRange={dateRange}
            />
          </TabsContent>

          <TabsContent value="flights">
            <FlightList 
              flights={flights}
              onDeleteFlight={deleteFlight}
            />
          </TabsContent>

          <TabsContent value="add">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-blue-500" />
                    Log New Flight
                  </CardTitle>
                  <CardDescription>
                    Add your flight details to track your travel days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FlightForm onAddFlight={addFlight} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
