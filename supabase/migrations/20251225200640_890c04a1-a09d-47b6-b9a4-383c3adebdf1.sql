-- Drop the overly permissive INSERT policy on notifications
DROP POLICY IF EXISTS "System can create notifications for users" ON public.notifications;

-- Create a restrictive INSERT policy that only allows users to create notifications for themselves
-- System-generated notifications should use Edge Functions with service_role key which bypasses RLS
CREATE POLICY "Users can create their own notifications" 
ON public.notifications 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);