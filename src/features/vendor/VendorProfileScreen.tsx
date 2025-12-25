import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/app-store';
import { useAppNavigation } from '@/hooks/use-app-navigation';
import { useVendorById } from '@/hooks/use-data-queries';
import OriginalVendorProfileScreen from '@/components/stack/screens/VendorProfileScreen';
import { ProfileSkeleton } from '@/components/stack/ScreenSkeleton';
import { Vendor, Conversation } from '@/types/stack';

const VendorProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedVendor, userType, addConversation, setSelectedConversation } = useAppStore();
  const { navigateTo, goBack } = useAppNavigation();

  // If there's an ID in params, fetch that vendor
  const vendorId = id ? parseInt(id, 10) : null;
  const { data: fetchedVendor, isLoading } = useVendorById(vendorId);

  // Determine which vendor to show
  let vendor: Vendor | null = null;
  
  if (vendorId && fetchedVendor) {
    vendor = fetchedVendor;
  } else if (selectedVendor) {
    vendor = selectedVendor;
  } else if (userType === 'vendor') {
    // Vendor viewing their own profile preview
    vendor = {
      id: 0,
      name: 'Al-Mansouri Services',
      avatar: 'AM',
      rating: 4.9,
      reviews: 156,
      specialty: 'HVAC & AC Services',
      verified: true,
      favorite: false,
      lastJob: '',
      completedJobs: 500,
      lastJobDate: '',
      responseTime: '12 min',
      distance: '',
      avgPrice: '',
      completionRate: 98,
      phone: ''
    };
  }

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!vendor) {
    // Fallback - go back
    goBack();
    return null;
  }

  const handleStartChat = (conv: Conversation) => {
    addConversation(conv);
    setSelectedConversation(conv);
    navigateTo('chat');
  };

  return (
    <OriginalVendorProfileScreen
      vendor={vendor}
      onBack={goBack}
      onNavigate={navigateTo}
      onStartChat={handleStartChat}
    />
  );
};

export default VendorProfileScreen;
