-- Remove the policy that allows users to view their own OTP records
-- OTP verification should be server-side only via the send-otp edge function
DROP POLICY IF EXISTS "Users can view their own OTP records" ON public.phone_otp;

-- Also remove client-side insert/update/delete policies since all OTP operations
-- should go through the server-side edge function which uses service role
DROP POLICY IF EXISTS "Users can insert their own OTP records" ON public.phone_otp;
DROP POLICY IF EXISTS "Users can update their own OTP records" ON public.phone_otp;
DROP POLICY IF EXISTS "Users can delete own OTP records" ON public.phone_otp;

-- Add a comment explaining the security model
COMMENT ON TABLE public.phone_otp IS 'OTP codes for phone verification. All operations are server-side only via send-otp edge function. No client access allowed for security.';