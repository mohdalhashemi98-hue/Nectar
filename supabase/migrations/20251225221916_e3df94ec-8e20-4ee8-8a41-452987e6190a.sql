-- Explicitly deny anonymous access to profiles table (contains PII)
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Explicitly deny anonymous access to phone_otp table (contains auth codes)
CREATE POLICY "Deny anonymous access to phone_otp"
ON public.phone_otp
FOR SELECT
TO anon
USING (false);

-- Also deny anonymous INSERT/UPDATE/DELETE on phone_otp for completeness
CREATE POLICY "Deny anonymous insert on phone_otp"
ON public.phone_otp
FOR INSERT
TO anon
WITH CHECK (false);

CREATE POLICY "Deny anonymous update on phone_otp"
ON public.phone_otp
FOR UPDATE
TO anon
USING (false);

CREATE POLICY "Deny anonymous delete on phone_otp"
ON public.phone_otp
FOR DELETE
TO anon
USING (false);