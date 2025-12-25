-- 1. Fix vendor_stats: Remove overly permissive policy and restrict to own data
DROP POLICY IF EXISTS "Authenticated users can view vendor stats" ON public.vendor_stats;

-- Create policy so vendors can only view their own stats
CREATE POLICY "Vendors can view own stats"
ON public.vendor_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a public view with only customer-relevant metrics (no earnings)
CREATE OR REPLACE VIEW public.vendor_stats_public AS
SELECT 
  user_id,
  rating,
  reviews,
  completion_rate,
  response_time,
  total_jobs
FROM public.vendor_stats;

-- Grant access to the safe public view
GRANT SELECT ON public.vendor_stats_public TO authenticated;
GRANT SELECT ON public.vendor_stats_public TO anon;