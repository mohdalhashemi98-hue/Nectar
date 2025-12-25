import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Shield, Upload, ChevronLeft, ChevronRight, X, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import SignedImage from '@/components/shared/SignedImage';

interface VerificationStepProps {
  businessLicenseUrl: string | null;
  idPhotoUrl: string | null;
  onUpdate: (updates: Partial<{ businessLicenseUrl: string | null; idPhotoUrl: string | null }>) => void;
  onNext: () => void;
  onBack: () => void;
  userId: string | null;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ 
  businessLicenseUrl, 
  idPhotoUrl, 
  onUpdate, 
  onNext, 
  onBack,
  userId 
}) => {
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [uploadingId, setUploadingId] = useState(false);

  const handleFileUpload = async (
    file: File, 
    type: 'license' | 'id',
    setUploading: (v: boolean) => void
  ) => {
    if (!userId) return;
    
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('vendor-uploads')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Store the file path for signed URL generation (not public URL)
      if (type === 'license') {
        onUpdate({ businessLicenseUrl: data.path });
      } else {
        onUpdate({ idPhotoUrl: data.path });
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'license', setUploadingLicense);
    }
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'id', setUploadingId);
    }
  };

  const removeFile = (type: 'license' | 'id') => {
    if (type === 'license') {
      onUpdate({ businessLicenseUrl: null });
    } else {
      onUpdate({ idPhotoUrl: null });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center p-4 border-b border-border/50"
      >
        <button 
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center font-display text-xl font-bold pr-10">Verification</h1>
      </motion.div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Build Trust with Customers
          </h2>
          <p className="text-muted-foreground">
            Verified professionals get 3x more job requests
          </p>
        </motion.div>

        {/* Upload Cards */}
        <div className="space-y-4">
          {/* Business License */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden"
          >
            <input
              ref={licenseInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleLicenseChange}
              className="hidden"
            />
            
            {businessLicenseUrl ? (
              <div className="relative">
                <SignedImage 
                  bucket="vendor-uploads"
                  path={businessLicenseUrl} 
                  alt="Business License" 
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFile('license')}
                  className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-sm">
                  <FileCheck className="w-4 h-4" />
                  Uploaded
                </div>
              </div>
            ) : (
              <button
                onClick={() => licenseInputRef.current?.click()}
                disabled={uploadingLicense}
                className="w-full p-6 text-center hover:bg-muted/50 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {uploadingLicense ? (
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1">Business License</h3>
                <p className="text-sm text-muted-foreground">Upload your trade license or business registration</p>
              </button>
            )}
          </motion.div>

          {/* ID Photo */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 overflow-hidden"
          >
            <input
              ref={idInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleIdChange}
              className="hidden"
            />
            
            {idPhotoUrl ? (
              <div className="relative">
                <SignedImage 
                  bucket="vendor-uploads"
                  path={idPhotoUrl} 
                  alt="ID Document" 
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFile('id')}
                  className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-2 px-3 py-1.5 bg-green-500/90 backdrop-blur-sm rounded-full text-white text-sm">
                  <FileCheck className="w-4 h-4" />
                  Uploaded
                </div>
              </div>
            ) : (
              <button
                onClick={() => idInputRef.current?.click()}
                disabled={uploadingId}
                className="w-full p-6 text-center hover:bg-muted/50 transition-colors"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                  {uploadingId ? (
                    <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-7 h-7 text-accent-foreground" />
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-1">Photo ID</h3>
                <p className="text-sm text-muted-foreground">Emirates ID, Passport, or Driver's License</p>
              </button>
            )}
          </motion.div>
        </div>

        {/* Security Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-start gap-3 mt-6 p-4 bg-muted/50 rounded-2xl"
        >
          <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Your documents are encrypted and never shared with customers. We only use them to verify your identity.
          </p>
        </motion.div>
      </div>

      {/* Next Button */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 pb-8 border-t border-border/50 space-y-3"
      >
        <Button
          onClick={onNext}
          className="w-full h-14 rounded-2xl text-lg font-semibold"
        >
          Complete Registration
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        
        <Button
          variant="ghost"
          onClick={onNext}
          className="w-full h-12 rounded-2xl text-muted-foreground"
        >
          Skip for now
        </Button>
      </motion.div>
    </div>
  );
};

export default VerificationStep;
