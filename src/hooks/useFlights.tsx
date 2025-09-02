
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Flight {
  id: string;
  user_id: string;
  departure_country: string;
  arrival_country: string;
  departure_date: string;
  arrival_date: string;
  created_at: string;
  updated_at: string;
}

export const useFlights = () => {
  const queryClient = useQueryClient();

  const { data: flights = [], isLoading } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .order('departure_date', { ascending: false });

      if (error) throw error;
      return data as Flight[];
    },
    enabled: true,
  });

  const addFlightMutation = useMutation({
    mutationFn: async (flight: Omit<Flight, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('flights')
        .insert([{
          ...flight,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast({
        title: "Flight Added",
        description: "Your flight has been successfully logged!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteFlightMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('flights')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      toast({
        title: "Flight Deleted",
        description: "Your flight has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    flights,
    isLoading,
    addFlight: addFlightMutation.mutate,
    deleteFlight: deleteFlightMutation.mutate,
    isAddingFlight: addFlightMutation.isPending,
    isDeletingFlight: deleteFlightMutation.isPending,
  };
};
