-- Clean up existing SELECT policies on profiles table to remove any ambiguity
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a single clear PERMISSIVE SELECT policy
-- This ensures users can ONLY view their own profile data
-- Protects email, phone, id_document_url, and selfie_url from other users
CREATE POLICY "Users can only view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Add comment explaining the security model
COMMENT ON COLUMN public.profiles.id_document_url IS 'Sensitive: ID verification document. Protected by RLS - only profile owner can access.';
COMMENT ON COLUMN public.profiles.selfie_url IS 'Sensitive: Selfie for verification. Protected by RLS - only profile owner can access.';