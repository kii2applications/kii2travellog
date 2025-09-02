import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export interface Reminder {
  id: string;
  user_id: string;
  event_id?: string;
  title: string;
  message?: string;
  reminder_date: string;
  event_date?: string;
  country?: string;
  status: 'pending' | 'sent' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useReminders = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const { data: reminders = [], isLoading } = useQuery({
    queryKey: ['reminders', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('reminder_date', { ascending: true });
      if (error) throw error;
      return data as Reminder[];
    },
    enabled: !!session,
    retry: (failureCount, _error) => failureCount < 1,
  });

  const addReminderMutation = useMutation({
    mutationFn: async (reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reminders')
        .insert([{
          ...reminder,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast({
        title: "Reminder Added",
        description: "Your reminder has been successfully created!",
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

  const updateReminderMutation = useMutation({
    mutationFn: async ({ id, reminder }: { id: string; reminder: Partial<Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }) => {
      const { data, error } = await supabase
        .from('reminders')
        .update(reminder)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast({
        title: "Reminder Updated",
        description: "Your reminder has been successfully updated!",
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

  const deleteReminderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast({
        title: "Reminder Deleted",
        description: "Your reminder has been removed.",
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
    reminders,
    isLoading,
    addReminder: addReminderMutation.mutate,
    updateReminder: updateReminderMutation.mutate,
    deleteReminder: deleteReminderMutation.mutate,
    isAddingReminder: addReminderMutation.isPending,
    isUpdatingReminder: updateReminderMutation.isPending,
    isDeletingReminder: deleteReminderMutation.isPending,
  };
};