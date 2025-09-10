import React from 'react';
import { Vendor } from '@/lib/storage';
import { MapPin, Clock, Star, Sparkles, Zap } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';

interface HeroSectionProps {
  vendor: Vendor;
  template: 'future' | 'neo' | 'premium';
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendor, template }) => {
  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  if (template === 'future') {
    return (
      <section className="relative overflow-hidden min-h-[80vh] flex items-center" style={customStyle}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background">
          {vendor.storefront?.banner && (
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover opacity-20"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-2xl scale-150"></div>
              <VendorLogo 
                vendor={vendor}
                size="2xl"
                showFallback={true}
                variant="rounded"
                className="mx-auto relative z-10 backdrop-blur-sm bg-card/30 p-4 rounded-2xl border border-primary/20"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in slide-in-from-bottom-8 duration-1000">
              {vendor.storefront?.heroText || `${vendor.storeName}`}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
              {vendor.storefront?.heroSubtext || vendor.description || 'Experience the future of dining'}
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
              <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-full backdrop-blur-lg bg-primary/10 border border-primary/20">
                <Zap className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold">Lightning Fast</span>
              </div>
              <div className="flex items-center gap-3 glass-card px-6 py-3 rounded-full backdrop-blur-lg bg-secondary/10 border border-secondary/20">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold">Premium Quality</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (template === 'neo') {
    return (
      <section className="relative min-h-[75vh] flex items-center overflow-hidden" style={customStyle}>
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
          </div>
        )}
        
        {/* Bold geometric shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/20 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rotate-12 rounded-full"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <VendorLogo 
                    vendor={vendor}
                    size="xl"
                    showFallback={true}
                    variant="square"
                    className="border-4 border-primary"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 text-foreground leading-tight">
                  {vendor.storefront?.heroText || vendor.storeName}
                </h1>
                <div className="w-20 h-1 bg-gradient-primary mb-6"></div>
                <p className="text-xl text-muted-foreground mb-8 font-medium">
                  {vendor.storefront?.heroSubtext || vendor.description || 'Bold flavors. Modern style. Unforgettable experience.'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="font-bold">Fast Delivery</span>
                  </div>
                </div>
                <div className="bg-card border-l-4 border-secondary p-6 rounded-r-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-secondary" />
                    <span className="font-bold">Fresh & Hot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Premium template
  return (
    <section className="relative min-h-[70vh] flex items-center" style={customStyle}>
      {vendor.storefront?.banner && (
        <div className="absolute inset-0 opacity-30">
          <img 
            src={vendor.storefront.banner} 
            alt="Store banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80"></div>
        </div>
      )}
      
      <div className="relative container mx-auto px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full scale-150 blur-2xl"></div>
            <VendorLogo 
              vendor={vendor}
              size="xl"
              showFallback={true}
              variant="rounded"
              className="mx-auto relative z-10 border-2 border-primary/10 p-2"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-light mb-8 text-foreground tracking-wide leading-tight">
            {vendor.storefront?.heroText || vendor.storeName}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            {vendor.storefront?.heroSubtext || vendor.description || 'Crafted with passion. Served with excellence. An experience beyond ordinary.'}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-light">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-light">Timely Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;