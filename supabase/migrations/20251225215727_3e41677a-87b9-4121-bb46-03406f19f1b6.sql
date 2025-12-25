-- Fix Security Issues

-- 1. Drop the overly permissive policy on available_jobs that allows anyone (including unauthenticated) to view
DROP POLICY IF EXISTS "Anyone can view available jobs" ON public.available_jobs;

-- Create a new policy that only allows authenticated users to view available jobs
CREATE POLICY "Authenticated users can view available jobs"
ON public.available_jobs
FOR SELECT
TO authenticated
USING (true);

-- 2. Allow authenticated users to view vendor_profiles (for marketplace browsing)
CREATE POLICY "Authenticated users can view vendor profiles"
ON public.vendor_profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Allow authenticated users to view vendor_stats (for marketplace transparency)
-- First, add a policy for public stats viewing (rating, reviews, completion_rate - non-sensitive)
CREATE POLICY "Authenticated users can view vendor stats"
ON public.vendor_stats
FOR SELECT
TO authenticated
USING (true);

-- 4. Fix vendors table - require authentication for viewing
DROP POLICY IF EXISTS "Authenticated users can view vendors" ON public.vendors;

CREATE POLICY "Authenticated users can view vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (true);