import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  user_id: string;
  type: 'job_status' | 'quote_received' | 'message' | 'job_completed' | 'payment' | 'system';
  title: string;
  message: string;
  icon?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Server configuration error');
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const payload: NotificationPayload = await req.json();
    console.log('Received notification payload:', JSON.stringify(payload));

    // Validate required fields
    if (!payload.user_id || !payload.title || !payload.type) {
      console.error('Missing required fields:', { user_id: !!payload.user_id, title: !!payload.title, type: !!payload.type });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: user_id, title, and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map notification type to icon
    const iconMap: Record<string, string> = {
      job_status: 'briefcase',
      quote_received: 'file-text',
      message: 'message-circle',
      job_completed: 'check-circle',
      payment: 'credit-card',
      system: 'bell',
    };

    // Insert notification using service role (bypasses RLS)
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: payload.user_id,
        type: payload.type,
        title: payload.title,
        message: payload.message || '',
        icon: payload.icon || iconMap[payload.type] || 'bell',
        time: 'Just now',
        unread: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error inserting notification:', error);
      throw error;
    }

    console.log('Notification created successfully:', data.id);

    return new Response(
      JSON.stringify({ success: true, notification: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error in send-notification function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
