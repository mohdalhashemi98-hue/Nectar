import StackAppRouter from '@/components/stack/StackAppRouter';
import RealtimeProvider from '@/components/realtime/RealtimeProvider';

const Index = () => {
  return (
    <div className="min-h-[100dvh] bg-muted flex justify-center p-4">
      <RealtimeProvider>
        <StackAppRouter />
      </RealtimeProvider>
    </div>
  );
};

export default Index;