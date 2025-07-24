import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_ANON_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Get user data
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid authorization token');
    }

    // Get current days in country
    const { data: flights } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user.id)
      .order('departure_date', { ascending: false });

    let currentDays = 0;
    let currentCountry = "Not traveling";
    
    if (flights && flights.length > 0) {
      const today = new Date();
      
      // Find if user is currently in a country
      for (const flight of flights) {
        const departureDate = new Date(flight.departure_date);
        const arrivalDate = new Date(flight.arrival_date);
        
        if (departureDate <= today && arrivalDate >= today) {
          currentCountry = flight.arrival_country;
          currentDays = Math.floor((today.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
          break;
        }
      }
    }

    // Get upcoming events
    const { data: events } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(1);

    let nextEvent = null;
    if (events && events.length > 0) {
      const event = events[0];
      nextEvent = {
        name: event.event_name,
        country: event.country,
        date: new Date(event.event_date).toLocaleDateString()
      };
    }

    // Update widget data files
    const daysData = {
      days: currentDays,
      country: currentCountry,
      lastUpdated: new Date().toISOString()
    };

    const eventsData = {
      event: nextEvent,
      lastUpdated: new Date().toISOString()
    };

    // Note: In a real implementation, you'd write these to a storage bucket
    // For now, we'll return the data for client-side handling
    return new Response(
      JSON.stringify({
        success: true,
        daysData,
        eventsData
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});