import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Vendor } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface HeroSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendor, template }) => {
  const heroText = vendor.storefront?.heroText || `Welcome to ${vendor.storeName}`;
  const heroSubtext = vendor.storefront?.heroSubtext || 'Experience exceptional food and service';
  const heroBanner = vendor.storefront?.banner;

  // Modern Glass template - immersive glassmorphism hero
  if (template === 'modern-glass') {
    return (
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          {heroBanner ? (
            <img 
              src={heroBanner} 
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
              style={{
                backgroundImage: `url(${getDefaultPlaceholder('hero')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white/35 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}></div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Glass card container */}
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/25">
              <div className="bg-gradient-to-b from-white/5 to-transparent rounded-2xl p-6 md:p-8">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                    {heroText}
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed font-light">
                  {heroSubtext}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="xl" 
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <span className="text-lg font-semibold">Order Now</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl"
                    className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  >
                    <span className="text-lg">View Menu</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">5★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">30min</div>
                <div className="text-sm text-white/80">Delivery</div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center col-span-2 md:col-span-1">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-white/80">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{heroText}</h1>
        <p className="text-xl text-gray-600 mb-8">{heroSubtext}</p>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
};

export default HeroSection;