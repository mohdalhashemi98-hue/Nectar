-- Fix conflicting storage policy on vendor-uploads bucket
-- Remove the public SELECT policy since the bucket is private
DROP POLICY IF EXISTS "Public can view vendor uploads" ON storage.objects;

-- For profiles table, clean up redundant policies
DROP POLICY IF EXISTS "Users can only view own profile" ON public.profiles;
-- Keep "Users can view their own profile" policy

-- For phone_otp table, clean up redundant policies  
DROP POLICY IF EXISTS "Users can insert own OTP records" ON public.phone_otp;
DROP POLICY IF EXISTS "Users can update own OTP records" ON public.phone_otp;
-- Keep the named policies with consistent naming

-- Add explicit policy for vendor_stats_public view to clarify its access
-- First drop if exists, then create
DROP POLICY IF EXISTS "Anyone can view public vendor stats" ON public.vendor_stats_public;

-- Since vendor_stats_public is a view with security_invoker=true, RLS policies apply from the underlying table
-- The view is already secured by the vendor_stats RLS policies, no additional policy needed on the view itself