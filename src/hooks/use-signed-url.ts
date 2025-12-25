import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to get a signed URL for a file in a private bucket
 * @param bucket - The storage bucket name
 * @param path - The file path (can be a full public URL or just the path)
 * @param expiresIn - URL expiration in seconds (default 1 hour)
 */
export const useSignedUrl = (
  bucket: string,
  path: string | null | undefined,
  expiresIn: number = 3600
) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setSignedUrl(null);
      return;
    }

    const getSignedUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        // Extract the file path from a full URL if necessary
        let filePath = path;
        
        // If it's a full URL, extract the path after the bucket name
        if (path.includes('/storage/v1/object/public/')) {
          const parts = path.split(`/storage/v1/object/public/${bucket}/`);
          if (parts.length > 1) {
            filePath = parts[1];
          }
        }

        const { data, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(filePath, expiresIn);

        if (signError) throw signError;

        setSignedUrl(data.signedUrl);
      } catch (err) {
        console.error('Error getting signed URL:', err);
        setError(err instanceof Error ? err : new Error('Failed to get signed URL'));
        // Fallback to original path if it fails
        setSignedUrl(path);
      } finally {
        setLoading(false);
      }
    };

    getSignedUrl();
  }, [bucket, path, expiresIn]);

  return { signedUrl, loading, error };
};

/**
 * Utility function to get a signed URL (for non-hook contexts)
 */
export const getSignedUrl = async (
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> => {
  // Extract the file path from a full URL if necessary
  let filePath = path;
  
  if (path.includes('/storage/v1/object/public/')) {
    const parts = path.split(`/storage/v1/object/public/${bucket}/`);
    if (parts.length > 1) {
      filePath = parts[1];
    }
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error('Error getting signed URL:', error);
    return path; // Fallback to original
  }

  return data.signedUrl;
};
