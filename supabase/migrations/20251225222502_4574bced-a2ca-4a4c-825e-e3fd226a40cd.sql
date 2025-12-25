-- 1. Fix profiles table: Add policy so users can only view their own profile
CREATE POLICY "Users can only view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. Fix phone_otp table: Remove ability to SELECT otp_code values
-- First, deny all SELECT access to authenticated users for this sensitive table
CREATE POLICY "Deny authenticated select on phone_otp"
ON public.phone_otp
FOR SELECT
TO authenticated
USING (false);

-- Allow users to only INSERT their own OTP records (for the edge function)
CREATE POLICY "Users can insert own OTP records"
ON public.phone_otp
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own OTP records (for verification)
CREATE POLICY "Users can update own OTP records"
ON public.phone_otp
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own OTP records
CREATE POLICY "Users can delete own OTP records"
ON public.phone_otp
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);