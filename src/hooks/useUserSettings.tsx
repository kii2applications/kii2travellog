
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UserSettings {
  id: string;
  user_id: string;
  custom_year_start_month: number;
  custom_year_start_day: number;
  created_at: string;
  updated_at: string;
}

export const useUserSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return {
          custom_year_start_month: 4, // April
          custom_year_start_day: 1,   // 1st
        };
      }

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      // Return default settings if no user settings found
      if (!data) {
        return {
          custom_year_start_month: 4, // April
          custom_year_start_day: 1,   // 1st
        };
      }
      
      return data as UserSettings;
    },
    enabled: true,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: { 
      custom_year_start_month?: number; 
      custom_year_start_day?: number;
    }) => {
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .single();

      if (existingSettings) {
        // Update existing settings
        const { data, error } = await supabase
          .from('user_settings')
          .update(newSettings)
          .eq('id', existingSettings.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new settings
        const { data, error } = await supabase
          .from('user_settings')
          .insert([{
            ...newSettings,
            custom_year_start_month: newSettings.custom_year_start_month || 4,
            custom_year_start_day: newSettings.custom_year_start_day || 1,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved!",
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
    settings,
    isLoading,
    updateSettings: updateSettingsMutation.mutate,
    isUpdatingSettings: updateSettingsMutation.isPending,
  };
};
