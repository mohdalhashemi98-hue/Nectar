import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Building2, Clock, FileText, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { categories } from '@/data/stack-data';
import { useVendorOnboardingStore } from '@/stores/vendor-onboarding-store';
import { useEffect } from 'react';

const MAX_BIO_LENGTH = 500;

const coreIdentitySchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(100),
  yearsExperience: z.number().min(0).max(100),
  bio: z.string().min(20, 'Bio must be at least 20 characters').max(MAX_BIO_LENGTH),
  serviceCategory: z.string().min(1, 'Please select a service category'),
});

type CoreIdentityFormData = z.infer<typeof coreIdentitySchema>;

interface CoreIdentityStepProps {
  onValidChange: (isValid: boolean) => void;
}

const CoreIdentityStep = ({ onValidChange }: CoreIdentityStepProps) => {
  const { data, updateData } = useVendorOnboardingStore();
  
  const form = useForm<CoreIdentityFormData>({
    resolver: zodResolver(coreIdentitySchema),
    defaultValues: {
      businessName: data.businessName,
      yearsExperience: data.yearsExperience,
      bio: data.bio,
      serviceCategory: data.serviceCategory,
    },
    mode: 'onChange',
  });

  const { watch, formState: { isValid } } = form;
  const bio = watch('bio');
  const bioLength = bio?.length || 0;

  // Update store on form changes
  useEffect(() => {
    const subscription = watch((value) => {
      updateData({
        businessName: value.businessName || '',
        yearsExperience: value.yearsExperience || 0,
        bio: value.bio || '',
        serviceCategory: value.serviceCategory || '',
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateData]);

  // Notify parent of validation state
  useEffect(() => {
    onValidChange(isValid);
  }, [isValid, onValidChange]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* Business Name */}
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4 text-primary" />
                Business Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Al-Mansouri AC Services"
                  className="input-modern"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Years of Experience */}
        <FormField
          control={form.control}
          name="yearsExperience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground">
                <Clock className="w-4 h-4 text-primary" />
                Years of Experience
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={0}
                  max={100}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  className="input-modern"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Category */}
        <FormField
          control={form.control}
          name="serviceCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground">
                <Briefcase className="w-4 h-4 text-primary" />
                Primary Service Category
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="input-modern">
                    <SelectValue placeholder="Select your main service area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-foreground">
                <FileText className="w-4 h-4 text-primary" />
                About Your Business
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    {...field}
                    placeholder="Tell customers what makes your business special. Highlight your expertise, approach, and commitment to quality..."
                    className="input-modern min-h-[140px] resize-none pb-8"
                    maxLength={MAX_BIO_LENGTH}
                  />
                  <div className={`
                    absolute bottom-3 right-3 text-xs font-medium
                    ${bioLength > MAX_BIO_LENGTH * 0.9 ? 'text-destructive' : 'text-muted-foreground'}
                  `}>
                    {bioLength}/{MAX_BIO_LENGTH}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CoreIdentityStep;
