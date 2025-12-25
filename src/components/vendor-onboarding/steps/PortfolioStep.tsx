import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image as ImageIcon, Camera, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVendorOnboardingStore, PortfolioItem } from '@/stores/vendor-onboarding-store';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioStepProps {
  onValidChange: (isValid: boolean) => void;
}

const PortfolioStep = ({ onValidChange }: PortfolioStepProps) => {
  const { data, addPortfolioItem, updatePortfolioItem, removePortfolioItem } = useVendorOnboardingStore();
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Portfolio is optional
  useEffect(() => {
    onValidChange(true);
  }, [onValidChange]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to upload files');
        return;
      }

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 5MB)`);
          continue;
        }

        const itemId = Date.now().toString() + Math.random().toString(36).slice(2);
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/portfolio/${itemId}.${fileExt}`;

        const { error } = await supabase.storage
          .from('vendor-uploads')
          .upload(fileName, file, { upsert: true });

        if (error) {
          console.error('Upload error:', error);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('vendor-uploads')
          .getPublicUrl(fileName);

        const item: PortfolioItem = {
          id: itemId,
          imageUrl: publicUrl,
          caption: '',
        };

        addPortfolioItem(item);
      }

      toast.success('Portfolio updated!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const startEditCaption = (item: PortfolioItem) => {
    setEditingId(item.id);
    setEditCaption(item.caption);
  };

  const saveCaption = () => {
    if (editingId) {
      updatePortfolioItem(editingId, { caption: editCaption });
      setEditingId(null);
      setEditCaption('');
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Work Portfolio</span>
        </div>
        <span className="text-xs text-muted-foreground">{data.portfolio.length} photos</span>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {data.portfolio.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              layout
              className="relative aspect-square rounded-2xl overflow-hidden group bg-secondary"
            >
              <img
                src={item.imageUrl}
                alt={item.caption || 'Portfolio item'}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Delete button */}
                <button
                  onClick={() => removePortfolioItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-destructive rounded-lg text-destructive-foreground"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Caption area */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <Input
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        placeholder="Add caption..."
                        className="h-8 text-xs bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveCaption()}
                      />
                      <Button
                        size="sm"
                        onClick={saveCaption}
                        className="h-8 px-2"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditCaption(item)}
                      className="w-full text-left"
                    >
                      {item.caption ? (
                        <p className="text-white text-xs line-clamp-2">{item.caption}</p>
                      ) : (
                        <p className="text-white/60 text-xs flex items-center gap-1">
                          <Pencil className="w-3 h-3" />
                          Add caption
                        </p>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Caption preview when not hovering */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity">
                  <p className="text-white text-xs line-clamp-1">{item.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleFileSelect}
          disabled={uploading}
          className="aspect-square rounded-2xl border-2 border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-colors"
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Add Photos</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Tips */}
      <div className="bg-primary/5 rounded-2xl p-4">
        <h4 className="font-medium text-sm text-foreground mb-2">💡 Portfolio Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Show before & after photos when possible</li>
          <li>• Include a variety of project types</li>
          <li>• Add captions to describe the work done</li>
          <li>• Use high-quality, well-lit photos</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioStep;
