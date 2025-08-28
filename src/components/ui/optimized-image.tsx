import React, { useState } from 'react';
import { getImagePath, handleImageError, ImageConfig } from '@/utils/imageUtils';

interface OptimizedImageProps extends ImageConfig {
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onLoad?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallback = getImagePath('images/icons/placeholder.svg'),
  loading = 'lazy',
  className = '',
  width,
  height,
  style,
  onClick,
  onLoad,
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [currentSrc, setCurrentSrc] = useState(getImagePath(src));

  const handleLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageState('error');
    // Only set fallback if we haven't already tried it
    if (currentSrc !== fallback) {
      setCurrentSrc(fallback);
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{ width, height, ...style }}
    >
      {imageState === 'loading' && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      
      <img
        src={currentSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0'
        } ${onClick ? 'cursor-pointer' : ''}`}
        {...props}
      />
      
      {imageState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          <span>Image not available</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
