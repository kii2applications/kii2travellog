import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.9";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderNotificationRequest {
  reminderId: string;
  title: string;
  message?: string;
  reminderDate: string;
  eventDate?: string;
  country?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get user from auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { reminderId, title, message, reminderDate, eventDate, country }: ReminderNotificationRequest = await req.json();

    // Validate required fields
    if (!reminderId || !title || !reminderDate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format dates for email
    const reminderDateFormatted = new Date(reminderDate).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });

    const eventDateFormatted = eventDate ? new Date(eventDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }) : null;

    // Create email content
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">📅 Reminder Notification</h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #495057; margin-top: 0;">${title}</h2>
          ${message ? `<p style="color: #6c757d; font-size: 16px;">${message}</p>` : ''}
        </div>
        
        <div style="background-color: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
          <p style="margin: 0; color: #1976d2;"><strong>⏰ Reminder Time:</strong> ${reminderDateFormatted}</p>
        </div>
        
        ${eventDateFormatted ? `
          <div style="background-color: #f3e5f5; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <p style="margin: 0; color: #7b1fa2;"><strong>📅 Event Date:</strong> ${eventDateFormatted}</p>
          </div>
        ` : ''}
        
        ${country ? `
          <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
            <p style="margin: 0; color: #2e7d32;"><strong>📍 Location:</strong> ${country}</p>
          </div>
        ` : ''}
        
        <hr style="border: none; border-top: 1px solid #dee2e6; margin: 20px 0;">
        
        <p style="color: #6c757d; font-size: 14px; text-align: center;">
          This is a test notification from your reminder system.<br>
          Reminder ID: ${reminderId}
        </p>
      </div>
    `;

    console.log(`Sending reminder notification to ${user.email} for reminder: ${title}`);

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Reminders <noreply@kii2connect.com>",
      to: [user.email],
      subject: `🔔 Reminder: ${title}`,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error("Resend email error:", emailResponse.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: emailResponse.error,
          message: "Failed to send reminder notification",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: "Reminder notification sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reminder-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);