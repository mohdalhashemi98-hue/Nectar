import { Suspense, lazy } from 'react';
import RealtimeProvider from '@/components/realtime/RealtimeProvider';

// Lazy load the router for faster initial paint
const StackAppRouter = lazy(() => import('@/components/stack/StackAppRouter'));

// Simple loading spinner
const LoadingSpinner = () => (
  <div className="min-h-[100dvh] bg-background flex items-center justify-center">
    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center animate-pulse">
      <div className="w-6 h-6 rounded-xl bg-primary/40" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-[100dvh] bg-muted flex justify-center p-4">
      <RealtimeProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <StackAppRouter />
        </Suspense>
      </RealtimeProvider>
    </div>
  );
};

export default Index;