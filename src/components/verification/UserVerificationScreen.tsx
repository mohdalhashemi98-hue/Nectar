import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Phone, Camera, Upload, CheckCircle, Shield, 
  Loader2, AlertCircle, User, FileImage, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useUserVerification, VerificationStatus } from '@/hooks/use-user-verification';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { toast } from 'sonner';

type Step = 'start' | 'phone' | 'otp' | 'id-upload' | 'selfie' | 'complete';

const UserVerificationScreen: React.FC = () => {
  const { goBack, navigateTo } = useAppNavigation();
  const {
    isSendingOtp,
    isVerifyingOtp,
    isUploadingId,
    checkVerificationStatus,
    sendOtp,
    verifyOtp,
    uploadIdDocument,
    uploadSelfie,
    submitForVerification,
  } = useUserVerification();

  const [step, setStep] = useState<Step>('start');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Check existing verification status
  useEffect(() => {
    checkVerificationStatus().then((status) => {
      setVerificationStatus(status);
      if (status?.phone_verified && status?.id_verified) {
        setStep('complete');
      } else if (status?.phone_verified) {
        setStep('id-upload');
      }
    });
  }, [checkVerificationStatus]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    // Format phone number with + if not present
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const success = await sendOtp(formattedPhone);
    if (success) {
      setStep('otp');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit code');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const success = await verifyOtp(formattedPhone, otp);
    if (success) {
      setStep('id-upload');
    }
  };

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIdFile(file);
    const path = await uploadIdDocument(file);
    if (path) {
      setStep('selfie');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Unable to access camera. Please upload a photo instead.');
    }
  };

  const captureSelfie = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      setSelfieFile(file);

      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);

      const path = await uploadSelfie(file);
      if (path) {
        await handleSubmitVerification();
      }
    }, 'image/jpeg', 0.9);
  }, [uploadSelfie]);

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setSelfieFile(file);
    const path = await uploadSelfie(file);
    if (path) {
      await handleSubmitVerification();
    }
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    const success = await submitForVerification();
    setIsSubmitting(false);
    if (success) {
      setStep('complete');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'start':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Verify Your Identity
            </h2>
            <p className="text-muted-foreground mb-8">
              To post jobs and protect our community, we need to verify your identity.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Phone Verification</p>
                  <p className="text-sm text-muted-foreground">Verify with SMS code</p>
                </div>
                {verificationStatus?.phone_verified && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileImage className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">ID Document</p>
                  <p className="text-sm text-muted-foreground">Upload government-issued ID</p>
                </div>
                {verificationStatus?.id_verified && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-card rounded-2xl border border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">Selfie Verification</p>
                  <p className="text-sm text-muted-foreground">Match your face to ID</p>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep('phone')} 
              className="w-full h-14 rounded-2xl text-lg font-semibold"
            >
              Start Verification
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        );

      case 'phone':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">
              Verify Phone Number
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              We'll send a verification code to this number
            </p>

            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 text-lg rounded-2xl"
              />

              <Button 
                onClick={handleSendOtp}
                disabled={isSendingOtp || phone.length < 10}
                className="w-full h-14 rounded-2xl text-lg font-semibold"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            </div>
          </motion.div>
        );

      case 'otp':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Enter Verification Code
            </h2>
            <p className="text-muted-foreground mb-8">
              We sent a 6-digit code to {phone}
            </p>

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || otp.length !== 6}
              className="w-full h-14 rounded-2xl text-lg font-semibold"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </Button>

            <button 
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="mt-4 text-primary hover:underline"
            >
              Resend Code
            </button>
          </motion.div>
        );

      case 'id-upload':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <FileImage className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Upload ID Document
            </h2>
            <p className="text-muted-foreground mb-8">
              Upload a clear photo of your government-issued ID
            </p>

            <input
              ref={idInputRef}
              type="file"
              accept="image/*"
              onChange={handleIdUpload}
              className="hidden"
            />

            <button
              onClick={() => idInputRef.current?.click()}
              disabled={isUploadingId}
              className="w-full aspect-video bg-card border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors"
            >
              {isUploadingId ? (
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Tap to upload</p>
                    <p className="text-sm text-muted-foreground">JPG, PNG up to 10MB</p>
                  </div>
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-secondary/50 rounded-xl text-left">
              <p className="text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Accepted documents: Passport, Driver's License, National ID
              </p>
            </div>
          </motion.div>
        );

      case 'selfie':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-6 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">
              Take a Selfie
            </h2>
            <p className="text-muted-foreground mb-6">
              We'll match your face to your ID document
            </p>

            {cameraActive ? (
              <div className="relative mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full aspect-square object-cover rounded-2xl"
                />
                <canvas ref={canvasRef} className="hidden" />
                <Button
                  onClick={captureSelfie}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 h-14 px-8 rounded-2xl"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={startCamera}
                  className="w-full h-14 rounded-2xl text-lg font-semibold"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </Button>

                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieUpload}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  onClick={() => selfieInputRef.current?.click()}
                  disabled={isUploadingId}
                  className="w-full h-12 rounded-2xl"
                >
                  {isUploadingId ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5 mr-2" />
                  )}
                  Upload Photo Instead
                </Button>
              </div>
            )}
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-3">
              Verification Complete!
            </h2>
            <p className="text-muted-foreground mb-8">
              Your identity has been verified. You can now post jobs on Stack.
            </p>

            <Button 
              onClick={() => navigateTo('consumer-home')}
              className="w-full h-14 rounded-2xl text-lg font-semibold"
            >
              Start Posting Jobs
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={goBack}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-lg font-bold text-foreground">Identity Verification</h1>
        </div>
      </div>

      {/* Progress */}
      {step !== 'start' && step !== 'complete' && (
        <div className="px-6 py-4">
          <div className="flex gap-2">
            {['phone', 'otp', 'id-upload', 'selfie'].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  ['phone', 'otp', 'id-upload', 'selfie'].indexOf(step) >= i
                    ? 'bg-primary'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserVerificationScreen;
