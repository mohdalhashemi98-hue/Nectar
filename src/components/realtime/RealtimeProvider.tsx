import React from 'react';
import { useRealtimeQuotes } from '@/hooks/use-realtime-quotes';

/**
 * Provider component that sets up real-time subscriptions for the app.
 * This should be placed inside the authenticated app area.
 */
export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set up real-time quote notifications
  useRealtimeQuotes();

  return <>{children}</>;
};

export default RealtimeProvider;
