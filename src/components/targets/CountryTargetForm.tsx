
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const targetSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  minimum_days: z.number().min(1, 'Minimum days must be at least 1'),
  year_start_month: z.number().min(1).max(12),
  year_start_day: z.number().min(1).max(31),
});

type TargetFormData = z.infer<typeof targetSchema>;

interface CountryTargetFormProps {
  onSubmit: (data: TargetFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<TargetFormData>;
}

export const CountryTargetForm: React.FC<CountryTargetFormProps> = ({ 
  onSubmit, 
  isLoading,
  initialData 
}) => {
  const form = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: {
      year_start_month: 3,
      year_start_day: 1,
      ...initialData,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="United States" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minimum_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Days Target</FormLabel>
              <FormControl>
                <div className="relative">
                  <Target className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="number" 
                    placeholder="30" 
                    className="pl-10"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year_start_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Start Month</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="12" 
                    placeholder="3"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year_start_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Start Day</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    max="31" 
                    placeholder="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Saving Target...' : 'Save Country Target'}
        </Button>
      </form>
    </Form>
  );
};
