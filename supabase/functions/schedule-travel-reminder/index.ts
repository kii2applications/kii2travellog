import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
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

interface TravelReminderRequest {
  eventId: string;
  eventDate: string;
  eventName: string;
  eventCountry: string;
  currentCountry: string;
  reminderDays: number;
}

// Input validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date > new Date();
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
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
    // Validate Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.log(`Invalid content type: ${contentType}`);
      return new Response(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Parse and validate request body
    let body: TravelReminderRequest;
    try {
      const rawBody = await req.text();
      if (rawBody.length > 10000) { // 10KB limit
        return new Response(
          JSON.stringify({ error: "Request body too large" }),
          { 
            status: 413, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.log("Invalid JSON in request body:", parseError);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate required fields
    if (!body.eventDate || !body.eventName || !body.eventCountry || !body.reminderDays) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate event date
    if (!isValidDate(body.eventDate)) {
      return new Response(
        JSON.stringify({ error: "Invalid event date format or date in the past" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate reminder days
    if (typeof body.reminderDays !== "number" || body.reminderDays < 1 || body.reminderDays > 365) {
      return new Response(
        JSON.stringify({ error: "Reminder days must be a number between 1 and 365" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Sanitize inputs
    const sanitizedEventName = sanitizeInput(body.eventName);
    const sanitizedEventCountry = sanitizeInput(body.eventCountry);
    const sanitizedCurrentCountry = sanitizeInput(body.currentCountry);

    // Check if Resend API key is configured
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

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

    // Get user data with proper validation
    const jwt = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user?.email) {
      console.log("Invalid user token:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Invalid token or user without email" }), 
        { 
          status: 401, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate user email
    if (!isValidEmail(user.email)) {
      console.log("Invalid user email format");
      return new Response(
        JSON.stringify({ error: "Invalid user email format" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Calculate reminder date
    const eventDateObj = new Date(body.eventDate);
    const reminderDate = new Date(eventDateObj);
    reminderDate.setDate(reminderDate.getDate() - body.reminderDays);

    console.log(`Sending travel reminder for user: ${user.id}, event: ${sanitizedEventName}`);

    // Send email with sanitized content
    const emailResponse = await resend.emails.send({
      from: "Travel Planner <onboarding@resend.dev>",
      to: [user.email],
      subject: `Travel Reminder: ${sanitizedEventName} in ${sanitizedEventCountry}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #007AFF;">Travel Reminder</h1>
          <p>Hi there!</p>
          
          <p>This is a friendly reminder that you have an upcoming event:</p>
          
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; color: #1d1d1f;">${sanitizedEventName}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(body.eventDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${sanitizedEventCountry}</p>
            <p style="margin: 5px 0;"><strong>Your Current Location:</strong> ${sanitizedCurrentCountry}</p>
          </div>
          
          <p>Since you're currently in ${sanitizedCurrentCountry} and your event is in ${sanitizedEventCountry}, you'll need to plan your travel.</p>
          
          <p><strong>Don't forget to:</strong></p>
          <ul>
            <li>Book your flights</li>
            <li>Check visa requirements</li>
            <li>Arrange accommodation</li>
            <li>Plan local transportation</li>
          </ul>
          
          <p>Safe travels!</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #d2d2d7;">
          <p style="color: #86868b; font-size: 12px;">
            This email was sent from your Travel Planner app. 
            You received this because you scheduled a travel reminder.
          </p>
        </div>
      `,
    });

    console.log("Travel reminder email sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in schedule-travel-reminder function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);