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
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      console.error('Missing environment variables');
      throw new Error('Server configuration error');
    }

    // First, verify the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with anon key to verify user token
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();
    
    if (userError || !user) {
      console.error('User authentication failed:', userError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role (bypasses RLS) for inserting
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const payload: NotificationPayload = await req.json();
    console.log('Received notification payload:', JSON.stringify(payload));
    console.log('Authenticated user:', user.id);

    // SECURITY: Users can only send notifications to themselves
    if (payload.user_id !== user.id) {
      console.error('User attempted to send notification to another user:', { sender: user.id, target: payload.user_id });
      return new Response(
        JSON.stringify({ error: 'Cannot send notifications to other users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
