-- Fix security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.vendor_stats_public;

CREATE VIEW public.vendor_stats_public 
WITH (security_invoker = true)
AS
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