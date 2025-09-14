import React from 'react';
import { Vendor } from '@/lib/storage';
import { MapPin, Clock, Star, Sparkles, Zap, Cpu } from 'lucide-react';
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
      <section className="relative min-h-screen flex items-center overflow-hidden" style={customStyle}>
        {/* Holographic grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse 4s ease-in-out infinite'
          }}></div>
        </div>

        {/* Dynamic animated background */}
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-secondary/40"></div>
          </div>
        )}
        
        {/* Floating holographic elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-secondary/30 to-transparent rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        <div className="relative container mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Logo and branding */}
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-primary rounded-full blur-xl opacity-30 animate-pulse"></div>
              <VendorLogo 
                vendor={vendor}
                size="2xl"
                showFallback={true}
                variant="rounded"
                className="relative z-10 backdrop-blur-sm bg-card/40 p-6 rounded-3xl border border-primary/30 shadow-2xl mx-auto lg:mx-0"
              />
            </div>
            
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-in slide-in-from-left-8 duration-1000 leading-tight">
                {vendor.storefront?.heroText || `${vendor.storeName}`}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-in slide-in-from-left-8 duration-1000 delay-300 max-w-lg">
                {vendor.storefront?.heroSubtext || vendor.description || 'Step into the future of culinary excellence'}
              </p>
            </div>
          </div>

          {/* Right side - Feature highlights in holographic cards */}
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-1000 delay-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative backdrop-blur-lg bg-card/30 p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Quantum Speed</h3>
                </div>
                <p className="text-muted-foreground">Experience instant ordering with our advanced tech</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative backdrop-blur-lg bg-card/30 p-6 rounded-2xl border border-secondary/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Premium Quality</h3>
                </div>
                <p className="text-muted-foreground">Crafted with precision and future ingredients</p>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative backdrop-blur-lg bg-card/30 p-6 rounded-2xl border border-accent/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">AI Powered</h3>
                </div>
                <p className="text-muted-foreground">Smart recommendations tailored just for you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
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