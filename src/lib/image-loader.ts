/**
 * Custom image loader for Netlify that handles image optimization
 * 
 * This loader uses Netlify's built-in image transformation service
 * for production and regular URLs for development.
 */
export default function netlifyImageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // In development, just serve the image directly
  if (process.env.NODE_ENV !== 'production') {
    return src;
  }
  
  // For production on Netlify, use Netlify's image transformation
  const params = new URLSearchParams({
    w: width.toString(),
    q: (quality || 75).toString(),
    fit: 'cover',
  });

  // Handle both relative and absolute URLs
  const url = src.startsWith('/') 
    ? `${process.env.NEXT_PUBLIC_SITE_URL || ''}${src}`
    : src;
    
  // Return the Netlify optimized image URL
  return `/.netlify/images?${params.toString()}&url=${encodeURIComponent(url)}`;
}