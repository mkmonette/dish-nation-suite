import React from 'react';
import { Store } from 'lucide-react';
import { Vendor } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface VendorLogoProps {
  vendor: Vendor;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFallback?: boolean;
  className?: string;
}

const VendorLogo: React.FC<VendorLogoProps> = ({ 
  vendor, 
  size = 'md', 
  showFallback = true,
  className 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const logoSrc = vendor.storefront?.logo;

  if (logoSrc) {
    return (
      <img 
        src={logoSrc}
        alt={`${vendor.storeName} logo`}
        className={cn(sizeClasses[size], 'object-contain', className)}
      />
    );
  }

  if (showFallback) {
    return (
      <div className={cn(
        sizeClasses[size], 
        'bg-primary rounded-full flex items-center justify-center flex-shrink-0',
        className
      )}>
        <Store className={cn(
          size === 'sm' ? 'h-3 w-3' : 
          size === 'md' ? 'h-4 w-4' : 
          size === 'lg' ? 'h-6 w-6' : 'h-8 w-8',
          'text-primary-foreground'
        )} />
      </div>
    );
  }

  return null;
};

export default VendorLogo;