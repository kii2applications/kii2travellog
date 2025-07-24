import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { 
      headers: corsHeaders,
      status: 200
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log(`Invalid method: ${req.method}`);
    return new Response(
      JSON.stringify({ error: "Method not allowed" }), 
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }

  try {
    // Get and validate Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Internal server error" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user data with proper error handling
    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      console.log("Invalid user token:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid token" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Processing widget update for user: ${user.id}`);

    // Get current days in country with error handling
    const { data: flights, error: flightsError } = await supabase
      .from('flights')
      .select('*')
      .eq('user_id', user.id)
      .order('departure_date', { ascending: false });

    if (flightsError) {
      console.error("Error fetching flights:", flightsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch flight data" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

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

    // Get upcoming events with error handling
    const { data: events, error: eventsError } = await supabase
      .from('user_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(1);

    if (eventsError) {
      console.error("Error fetching events:", eventsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch event data" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

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

    console.log("Widget data updated successfully");

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

  } catch (error: any) {
    console.error("Error in update-widget-data function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});