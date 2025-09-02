
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface CountryTarget {
  id: string;
  user_id: string;
  country: string;
  minimum_days: number;
  year_start_month: number;
  year_start_day: number;
  created_at: string;
  updated_at: string;
}

export const useCountryTargets = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { data: targets = [], isLoading } = useQuery({
    queryKey: ['country-targets', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('country_targets')
        .select('*')
        .order('country', { ascending: true });
      if (error) throw error;
      return data as CountryTarget[];
    },
    enabled: !!session,
    retry: (failureCount, _error) => failureCount < 1,
  });

  const addTargetMutation = useMutation({
    mutationFn: async (target: Omit<CountryTarget, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('country_targets')
        .insert([{
          ...target,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-targets'] });
      toast({
        title: "Target Added",
        description: "Your country target has been successfully added!",
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

  const deleteTargetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('country_targets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['country-targets'] });
      toast({
        title: "Target Deleted",
        description: "Your country target has been removed.",
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
    targets,
    isLoading,
    addTarget: addTargetMutation.mutate,
    deleteTarget: deleteTargetMutation.mutate,
    isAddingTarget: addTargetMutation.isPending,
    isDeletingTarget: deleteTargetMutation.isPending,
  };
};
