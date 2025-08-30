import React from 'react';
import { Store } from 'lucide-react';
import { Vendor } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface VendorLogoProps {
  vendor: Vendor;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showFallback?: boolean;
  className?: string;
  variant?: 'square' | 'circle' | 'rounded';
}

const VendorLogo: React.FC<VendorLogoProps> = ({ 
  vendor, 
  size = 'md', 
  showFallback = true,
  className,
  variant = 'rounded'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20 md:h-24 md:w-24'
  };

  const variantClasses = {
    square: '',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const logoSrc = vendor.storefront?.logo;

  if (logoSrc) {
    return (
      <img 
        src={logoSrc}
        alt={`${vendor.storeName} logo`}
        className={cn(
          sizeClasses[size], 
          variantClasses[variant],
          'object-contain bg-white/10 backdrop-blur-sm', 
          className
        )}
        onError={(e) => {
          // If image fails to load, hide it and show fallback if enabled
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (showFallback) {
    return (
      <div className={cn(
        sizeClasses[size], 
        variantClasses[variant],
        'bg-primary flex items-center justify-center flex-shrink-0 shadow-sm',
        className
      )}>
        <Store className={cn(
          size === 'sm' ? 'h-3 w-3' : 
          size === 'md' ? 'h-4 w-4' : 
          size === 'lg' ? 'h-6 w-6' : 
          size === 'xl' ? 'h-8 w-8' : 'h-10 w-10',
          'text-primary-foreground'
        )} />
      </div>
    );
  }

  return null;
};

export default VendorLogo;