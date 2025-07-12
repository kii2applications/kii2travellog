
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plane } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useFlights } from '@/hooks/useFlights';

export const FlightForm = () => {
  const { addFlight, isAddingFlight } = useFlights();
  const [formData, setFormData] = useState({
    departureCountry: '',
    arrivalCountry: '',
    departureDate: '',
    arrivalDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.departureCountry || !formData.arrivalCountry || !formData.departureDate || !formData.arrivalDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.departureDate) > new Date(formData.arrivalDate)) {
      toast({
        title: "Invalid Dates",
        description: "Departure date cannot be after arrival date.",
        variant: "destructive"
      });
      return;
    }

    addFlight({
      departure_country: formData.departureCountry,
      arrival_country: formData.arrivalCountry,
      departure_date: formData.departureDate,
      arrival_date: formData.arrivalDate,
    });

    // Reset form
    setFormData({
      departureCountry: '',
      arrivalCountry: '',
      departureDate: '',
      arrivalDate: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departureCountry">Departure Country</Label>
          <Input
            id="departureCountry"
            type="text"
            placeholder="e.g., United States"
            value={formData.departureCountry}
            onChange={(e) => setFormData(prev => ({ ...prev, departureCountry: e.target.value }))}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalCountry">Arrival Country</Label>
          <Input
            id="arrivalCountry"
            type="text"
            placeholder="e.g., France"
            value={formData.arrivalCountry}
            onChange={(e) => setFormData(prev => ({ ...prev, arrivalCountry: e.target.value }))}
            className="bg-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departureDate">Departure Date</Label>
          <Input
            id="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="arrivalDate">Arrival Date</Label>
          <Input
            id="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => setFormData(prev => ({ ...prev, arrivalDate: e.target.value }))}
            className="bg-white/50"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
        disabled={isAddingFlight}
      >
        <Plane className="mr-2 h-4 w-4" />
        {isAddingFlight ? "Adding Flight..." : "Add Flight"}
      </Button>
    </form>
  );
};
