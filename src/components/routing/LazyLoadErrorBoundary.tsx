import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

/**
 * LazyLoadErrorBoundary - Catches lazy loading failures
 * 
 * Specifically handles chunk loading failures that occur when:
 * - User loses internet while a chunk is downloading
 * - Deployment invalidates old chunk URLs
 * - Network timeout during lazy load
 */
export class LazyLoadErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Check if this is a chunk loading error
    const isChunkError = 
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Unable to preload CSS') ||
      error.message.includes('ChunkLoadError') ||
      error.name === 'ChunkLoadError';

    return { 
      hasError: true, 
      error,
      isChunkError,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LazyLoadErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    // Force a full page reload to get fresh chunks
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      const { isChunkError, error } = this.state;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 text-center">
          <div className={`w-16 h-16 rounded-full ${isChunkError ? 'bg-warning/10' : 'bg-destructive/10'} flex items-center justify-center mb-4`}>
            {isChunkError ? (
              <WifiOff className="w-8 h-8 text-warning" />
            ) : (
              <AlertCircle className="w-8 h-8 text-destructive" />
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {isChunkError ? 'Connection Issue' : 'Loading Failed'}
          </h2>
          
          <p className="text-muted-foreground mb-6 max-w-sm">
            {isChunkError 
              ? "We couldn't load this page. Please check your internet connection and try again."
              : "Something went wrong while loading this page. Please try again."}
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={this.handleRetry} className="gap-2 w-full">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button 
              onClick={this.handleGoHome} 
              variant="outline" 
              className="w-full"
            >
              Go Home
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <pre className="mt-6 p-4 bg-muted rounded-lg text-xs text-left overflow-auto max-w-full">
              {error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;
