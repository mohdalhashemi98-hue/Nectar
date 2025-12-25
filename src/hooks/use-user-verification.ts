import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

export interface VerificationStatus {
  phone_verified: boolean;
  id_verified: boolean;
  verification_status: string;
}

export const useUserVerification = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isUploadingId, setIsUploadingId] = useState(false);

  // Check verification status
  const checkVerificationStatus = useCallback(async (): Promise<VerificationStatus | null> => {
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('phone_verified, id_verified, verification_status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking verification status:', error);
      return null;
    }

    return data as VerificationStatus;
  }, [user?.id]);

  // Send OTP
  const sendOtp = useCallback(async (phone: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please log in to verify your phone');
      return false;
    }

    setIsSendingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone, action: 'send' },
      });

      if (error) {
        console.error('Send OTP error:', error);
        toast.error('Failed to send verification code');
        return false;
      }

      toast.success('Verification code sent!');
      return true;
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error('Failed to send verification code');
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  }, [user?.id]);

  // Verify OTP
  const verifyOtp = useCallback(async (phone: string, otp: string): Promise<boolean> => {
    if (!user?.id) {
      toast.error('Please log in to verify your phone');
      return false;
    }

    setIsVerifyingOtp(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phone, otp, action: 'verify' },
      });

      if (error) {
        console.error('Verify OTP error:', error);
        toast.error('Invalid or expired verification code');
        return false;
      }

      toast.success('Phone verified successfully!');
      return true;
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error('Verification failed');
      return false;
    } finally {
      setIsVerifyingOtp(false);
    }
  }, [user?.id]);

  // Upload ID document
  const uploadIdDocument = useCallback(async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast.error('Please log in to upload documents');
      return null;
    }

    setIsUploadingId(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/id-document.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('id-verification')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload ID document');
        return null;
      }

      // Update profile with document URL
      await supabase
        .from('profiles')
        .update({ 
          id_document_url: data.path,
          verification_submitted_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
      return null;
    } finally {
      setIsUploadingId(false);
    }
  }, [user?.id]);

  // Upload selfie
  const uploadSelfie = useCallback(async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast.error('Please log in to upload selfie');
      return null;
    }

    setIsUploadingId(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/selfie.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('id-verification')
        .upload(fileName, file, { upsert: true });

      if (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload selfie');
        return null;
      }

      // Update profile with selfie URL
      await supabase
        .from('profiles')
        .update({ selfie_url: data.path })
        .eq('user_id', user.id);

      return data.path;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload selfie');
      return null;
    } finally {
      setIsUploadingId(false);
    }
  }, [user?.id]);

  // Submit for verification (mark as pending review)
  const submitForVerification = useCallback(async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // For now, auto-approve ID verification (in production, this would trigger manual review)
      const { error } = await supabase
        .from('profiles')
        .update({ 
          id_verified: true,
          verification_status: 'verified',
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Verification submission error:', error);
        toast.error('Failed to submit verification');
        return false;
      }

      toast.success('ID verified successfully!');
      return true;
    } catch (error) {
      console.error('Verification error:', error);
      return false;
    }
  }, [user?.id]);

  return {
    isLoading,
    isSendingOtp,
    isVerifyingOtp,
    isUploadingId,
    checkVerificationStatus,
    sendOtp,
    verifyOtp,
    uploadIdDocument,
    uploadSelfie,
    submitForVerification,
  };
};

export default useUserVerification;
