
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useFlights } from '@/hooks/useFlights';

export const FlightForm = () => {
  const { addFlight, isAddingFlight } = useFlights();
  const [formData, setFormData] = useState({
    departureCountry: '',
    arrivalCountry: '',
    departureDate: undefined as Date | undefined,
    arrivalDate: undefined as Date | undefined,
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

    if (formData.departureDate > formData.arrivalDate) {
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
      departure_date: format(formData.departureDate, 'yyyy-MM-dd'),
      arrival_date: format(formData.arrivalDate, 'yyyy-MM-dd'),
    });

    // Reset form
    setFormData({
      departureCountry: '',
      arrivalCountry: '',
      departureDate: undefined,
      arrivalDate: undefined,
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
          <Label>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/50",
                  !formData.departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.departureDate ? format(formData.departureDate, "PPP") : "Pick departure date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.departureDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, departureDate: date }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Arrival Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/50",
                  !formData.arrivalDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.arrivalDate ? format(formData.arrivalDate, "PPP") : "Pick arrival date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.arrivalDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, arrivalDate: date }))}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
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
