import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Award, Building, X, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useVendorOnboardingStore, Certification } from '@/stores/vendor-onboarding-store';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SignedImage from '@/components/shared/SignedImage';

interface CertificationsStepProps {
  onValidChange: (isValid: boolean) => void;
}

const CertificationsStep = ({ onValidChange }: CertificationsStepProps) => {
  const { data, addCertification, updateCertification, removeCertification } = useVendorOnboardingStore();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCert, setNewCert] = useState({ title: '', issuingBody: '' });
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  // This step is optional, so always valid (or require at least 1 if you want)
  useEffect(() => {
    onValidChange(true); // Certifications are optional
  }, [onValidChange]);

  const handleAddCertification = () => {
    if (!newCert.title.trim() || !newCert.issuingBody.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const cert: Certification = {
      id: Date.now().toString(),
      title: newCert.title.trim(),
      issuingBody: newCert.issuingBody.trim(),
      imageUrl: null,
    };
    
    addCertification(cert);
    setNewCert({ title: '', issuingBody: '' });
    setIsAddingNew(false);
    toast.success('Certification added!');
  };

  const handleFileSelect = (certId: string) => {
    setActiveUploadId(certId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadingId(activeUploadId);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload files');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/certifications/${activeUploadId}-${Date.now()}.${fileExt}`;

      const { data: uploadData, error } = await supabase.storage
        .from('vendor-uploads')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      // Store the file path for signed URL generation (not public URL)
      updateCertification(activeUploadId, { imageUrl: fileName });
      toast.success('Certificate uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploadingId(null);
      setActiveUploadId(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Certifications & Licenses</span>
        </div>
        <span className="text-xs text-muted-foreground">Optional</span>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {data.certifications.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
              className="bg-card border border-border rounded-2xl p-4"
            >
              <div className="flex items-start gap-4">
                {/* Image/Upload Area */}
                <div className="flex-shrink-0">
                  {cert.imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden group">
                      <SignedImage 
                        bucket="vendor-uploads"
                        path={cert.imageUrl} 
                        alt={cert.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => updateCertification(cert.id, { imageUrl: null })}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleFileSelect(cert.id)}
                      disabled={uploadingId === cert.id}
                      className="w-16 h-16 rounded-xl border-2 border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center hover:border-primary/50 transition-colors"
                    >
                      {uploadingId === cert.id ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-4 h-4 text-muted-foreground mb-1" />
                          <span className="text-[10px] text-muted-foreground">Upload</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5" />
                    {cert.issuingBody}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {data.certifications.length === 0 && !isAddingNew && (
          <div className="bg-secondary/30 border border-dashed border-border rounded-2xl p-6 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Add your certifications and licenses to build trust with customers
            </p>
          </div>
        )}

        {/* Add New Form */}
        <AnimatePresence>
          {isAddingNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-4"
            >
              <div>
                <Label className="text-sm">Certificate/License Title</Label>
                <Input
                  value={newCert.title}
                  onChange={(e) => setNewCert(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., HVAC Certified Technician"
                  className="input-modern mt-1.5"
                />
              </div>
              
              <div>
                <Label className="text-sm">Issuing Body</Label>
                <Input
                  value={newCert.issuingBody}
                  onChange={(e) => setNewCert(prev => ({ ...prev, issuingBody: e.target.value }))}
                  placeholder="e.g., Dubai Economic Department"
                  className="input-modern mt-1.5"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsAddingNew(false);
                    setNewCert({ title: '', issuingBody: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddCertification}
                  className="flex-1 bg-primary"
                >
                  Add
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Button */}
        {!isAddingNew && (
          <Button
            variant="outline"
            onClick={() => setIsAddingNew(true)}
            className="w-full border-dashed border-2 h-12"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        )}
      </div>
    </div>
  );
};

export default CertificationsStep;
