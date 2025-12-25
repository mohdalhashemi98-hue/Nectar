-- 1. Make vendor-uploads bucket private
UPDATE storage.buckets SET public = false WHERE id = 'vendor-uploads';

-- 2. Update available_jobs policy to require authentication (not just 'true')
DROP POLICY IF EXISTS "Authenticated users can view available jobs" ON public.available_jobs;
CREATE POLICY "Authenticated users can view available jobs"
ON public.available_jobs
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);