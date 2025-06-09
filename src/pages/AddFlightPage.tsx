
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlightForm } from '@/components/FlightForm';
import { ExcelImport } from '@/components/ExcelImport';

export const AddFlightPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Flight</h1>
          <p className="text-gray-600">
            Add your flights manually or import from Excel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Flight Manually</CardTitle>
              <CardDescription>
                Enter your flight details manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlightForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import from Excel</CardTitle>
              <CardDescription>
                Upload an Excel file with your flight data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExcelImport />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
