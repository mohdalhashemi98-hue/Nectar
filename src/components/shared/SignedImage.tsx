import { useSignedUrl } from '@/hooks/use-signed-url';

interface SignedImageProps {
  bucket: string;
  path: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Component that displays an image from a private storage bucket using signed URLs
 */
const SignedImage = ({ bucket, path, alt, className, fallback }: SignedImageProps) => {
  const { signedUrl, loading } = useSignedUrl(bucket, path);

  if (!path) {
    return fallback ? <>{fallback}</> : null;
  }

  if (loading) {
    return (
      <div className={`bg-muted animate-pulse ${className}`} />
    );
  }

  return (
    <img
      src={signedUrl || ''}
      alt={alt}
      className={className}
    />
  );
};

export default SignedImage;
