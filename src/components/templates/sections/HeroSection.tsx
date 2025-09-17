import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Vendor } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import EmptySection from './EmptySection';

interface HeroSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendor, template }) => {
  const heroText = vendor.storefront?.heroText || `Welcome to ${vendor.storeName}`;
  const heroSubtext = vendor.storefront?.heroSubtext || 'Experience exceptional food and service';
  const heroBanner = vendor.storefront?.banner;

  // Check if hero section has meaningful content
  const hasContent = vendor.storefront?.heroText || vendor.storefront?.heroSubtext || vendor.storefront?.banner;

  // Modern Glass template - immersive mobile-first hero
  if (template === 'modern-glass') {
    if (!hasContent) {
      return <EmptySection sectionName="Hero Banner" message="Add hero text, subtext, or banner image to customize this section" />;
    }

    return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0">
          {heroBanner ? (
            <img 
              src={heroBanner} 
              alt="Hero background"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/50 to-purple-900/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/80"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/5 left-1/4 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute top-2/3 right-1/5 w-2 h-2 bg-purple-400/50 rounded-full animate-bounce" style={{animationDuration: '3s', animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-emerald-400/30 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        </div>

        {/* Main content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main hero card */}
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-12 lg:p-16 shadow-2xl">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold leading-tight">
                    <span className="bg-gradient-to-br from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      {heroText}
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    {heroSubtext}
                  </p>
                </div>

                {/* CTA buttons - mobile optimized */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="xl" 
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Order Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 text-lg transition-all duration-300 hover:scale-105"
                  >
                    Browse Menu
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature stats - mobile responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">4.9★</div>
                <div className="text-sm text-gray-300">Customer Rating</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
                <Clock className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">25min</div>
                <div className="text-sm text-gray-300">Avg Delivery</div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-all duration-300">
                <Truck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white mb-1">Free</div>
                <div className="text-sm text-gray-300">Delivery ₱500+</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce md:hidden">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse"></div>
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