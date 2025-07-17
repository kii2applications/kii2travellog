import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TravelReminderRequest {
  eventId: string;
  eventDate: string;
  eventName: string;
  eventCountry: string;
  currentCountry: string;
  reminderDays: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend API key is configured
    if (!resend) {
      throw new Error('RESEND_API_KEY not configured. Please add your Resend API key in the project settings.');
    }

    const {
      eventId, 
      eventDate, 
      eventName, 
      eventCountry, 
      currentCountry, 
      reminderDays 
    }: TravelReminderRequest = await req.json();

    // Get user info from auth
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Calculate reminder date
    const eventDateObj = new Date(eventDate);
    const reminderDate = new Date(eventDateObj);
    reminderDate.setDate(reminderDate.getDate() - reminderDays);

    // For demo purposes, we'll send the email immediately
    // In production, you'd schedule this with a cron job or queue system
    const emailResponse = await resend.emails.send({
      from: "Travel Planner <onboarding@resend.dev>",
      to: ["user@example.com"], // In production, get from user profile
      subject: `Travel Reminder: ${eventName} in ${eventCountry}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #007AFF;">Travel Reminder</h1>
          <p>Hi there!</p>
          
          <p>This is a friendly reminder that you have an upcoming event:</p>
          
          <div style="background: #f5f5f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="margin: 0 0 10px 0; color: #1d1d1f;">${eventName}</h2>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${eventCountry}</p>
            <p style="margin: 5px 0;"><strong>Your Current Location:</strong> ${currentCountry}</p>
          </div>
          
          <p>Since you're currently in ${currentCountry} and your event is in ${eventCountry}, you'll need to plan your travel.</p>
          
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

    console.log("Travel reminder email sent:", emailResponse);

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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);