-- Fix available_jobs INSERT policy (security fix)
DROP POLICY IF EXISTS "Users can insert available jobs" ON public.available_jobs;

CREATE POLICY "Users can insert available jobs"
ON public.available_jobs FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = available_jobs.job_id 
    AND jobs.user_id = auth.uid()
  )
);

-- Add verification fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_document_url TEXT,
ADD COLUMN IF NOT EXISTS selfie_url TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified',
ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMP WITH TIME ZONE;

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS public.phone_otp (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '10 minutes'),
  verified BOOLEAN DEFAULT false
);

ALTER TABLE public.phone_otp ENABLE ROW LEVEL SECURITY;

-- Users can only view/update their own OTP records
CREATE POLICY "Users can view their own OTP records"
ON public.phone_otp FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own OTP records"
ON public.phone_otp FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own OTP records"
ON public.phone_otp FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for ID verification documents (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-verification', 'id-verification', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for ID verification bucket
CREATE POLICY "Users can upload their own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'id-verification' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'id-verification' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own verification docs"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'id-verification' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own verification docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'id-verification' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add quote amount range constraint
ALTER TABLE public.quotes
ADD CONSTRAINT quotes_amount_range 
CHECK (amount >= 1 AND amount <= 1000000);

-- Create function to check if user is verified before posting jobs
CREATE OR REPLACE FUNCTION public.is_user_verified(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = user_uuid
    AND phone_verified = true
    AND id_verified = true
  );
$$;

-- Update jobs INSERT policy to require verification
DROP POLICY IF EXISTS "Users can insert their own jobs" ON public.jobs;

CREATE POLICY "Users can insert their own jobs"
ON public.jobs FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND public.is_user_verified(auth.uid())
);