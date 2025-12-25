-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view available jobs" ON public.available_jobs;

-- Create a permissive policy that allows anyone to view available jobs
CREATE POLICY "Anyone can view available jobs"
ON public.available_jobs
FOR SELECT
USING (true);