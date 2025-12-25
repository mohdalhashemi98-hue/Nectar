-- Create vendor_profiles table for the expertise builder
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Step 1: Core Identity
  business_name TEXT NOT NULL DEFAULT '',
  years_experience INTEGER DEFAULT 0,
  bio TEXT DEFAULT '',
  service_category TEXT DEFAULT '',
  
  -- Step 2: Skills & Tags (stored as JSONB array)
  skills JSONB DEFAULT '[]'::jsonb,
  
  -- Step 3: Certifications (stored as JSONB array of objects)
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Step 4: Portfolio (stored as JSONB array of objects with image URLs and captions)
  portfolio JSONB DEFAULT '[]'::jsonb,
  
  -- Onboarding progress
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Vendors can view their own profile"
ON public.vendor_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Vendors can insert their own profile"
ON public.vendor_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Vendors can update their own profile"
ON public.vendor_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Create storage bucket for vendor uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vendor-uploads', 'vendor-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for vendor uploads
CREATE POLICY "Vendors can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vendors can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'vendor-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public can view vendor uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'vendor-uploads');

CREATE POLICY "Vendors can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Vendors can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger for updated_at
CREATE TRIGGER update_vendor_profiles_updated_at
BEFORE UPDATE ON public.vendor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();