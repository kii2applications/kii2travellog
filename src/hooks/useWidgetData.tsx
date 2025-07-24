import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useWidgetData = () => {
  const updateWidgetData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/functions/v1/update-widget-data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        // Update local widget data files if possible
        // This would require a backend endpoint to write files
        console.log('Widget data updated:', result);
      }
    } catch (error) {
      console.error('Failed to update widget data:', error);
    }
  };

  useEffect(() => {
    // Update widget data on mount
    updateWidgetData();

    // Update every hour
    const interval = setInterval(updateWidgetData, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  return { updateWidgetData };
};