import React from 'react';
import { Vendor } from '@/lib/storage';
import { MapPin, Clock, Star } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';

interface HeroSectionProps {
  vendor: Vendor;
  template: 'modern' | 'classic' | 'minimal';
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendor, template }) => {
  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  if (template === 'modern') {
    return (
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground min-h-[60vh] md:min-h-[70vh] flex items-center" style={customStyle}>
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-none"></div>
          </div>
        )}
        {!vendor.storefront?.banner && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary"></div>
        )}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <VendorLogo 
                vendor={vendor}
                size="2xl"
                showFallback={true}
                variant="rounded"
                className="mx-auto"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-1000">
              {vendor.storefront?.heroText || `Welcome to ${vendor.storeName}`}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              {vendor.storefront?.heroSubtext || vendor.description || 'Delicious food delivered fresh to your door'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">30-45 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (template === 'classic') {
    return (
      <section className="relative bg-card border-b-4 border-primary/20 min-h-[50vh] md:min-h-[60vh] flex items-center" style={customStyle}>
        {vendor.storefront?.banner && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-card/80"></div>
          </div>
        )}
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="mb-4">
                <VendorLogo 
                  vendor={vendor}
                  size="xl"
                  showFallback={true}
                  variant="rounded"
                  className="mx-auto"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                {vendor.storefront?.heroText || vendor.storeName}
              </h1>
              <div className="w-32 h-0.5 bg-primary mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {vendor.storefront?.heroSubtext || vendor.description || 'Authentic flavors, timeless recipes, exceptional service'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Minimal template
  return (
    <section className="border-b border-border/50 relative min-h-[50vh] md:min-h-[55vh] flex items-center" style={customStyle}>
      {vendor.storefront?.banner && (
        <div className="absolute inset-0 opacity-10">
          <img 
            src={vendor.storefront.banner} 
            alt="Store banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70"></div>
        </div>
      )}
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="mb-8">
            <VendorLogo 
              vendor={vendor}
              size="xl"
              showFallback={true}
              variant="rounded"
              className="mx-auto opacity-90"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
            {vendor.storefront?.heroText || vendor.storeName}
          </h1>
          <div className="w-16 h-px bg-foreground mx-auto"></div>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            {vendor.storefront?.heroSubtext || vendor.description || 'Simple. Fresh. Delicious.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;