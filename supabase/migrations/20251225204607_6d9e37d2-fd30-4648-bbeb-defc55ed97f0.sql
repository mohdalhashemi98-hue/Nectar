-- Remove public access to vendors table and restrict to authenticated users only
-- This prevents anonymous access to vendor phone numbers

-- Drop the existing public policy
DROP POLICY IF EXISTS "Anyone can view vendors" ON public.vendors;

-- Create new policy allowing only authenticated users to view vendors
CREATE POLICY "Authenticated users can view vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (true);