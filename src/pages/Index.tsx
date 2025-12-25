import StackAppRouter from '@/components/stack/StackAppRouter';
import RealtimeProvider from '@/components/realtime/RealtimeProvider';

const Index = () => {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <RealtimeProvider>
        <StackAppRouter />
      </RealtimeProvider>
    </div>
  );
};

export default Index;