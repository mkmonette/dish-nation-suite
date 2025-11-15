import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Tag, Gift } from 'lucide-react';

interface PromoBannersSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section?: SectionConfig;
}

const PromoBannersSection: React.FC<PromoBannersSectionProps> = ({ vendor, template, section }) => {
  if (template === 'modern-glass') {
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Main promotional banner */}
          <div className="relative mb-12 overflow-hidden rounded-3xl">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 md:p-16">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 text-center text-white">
                <div className="mb-6">
                  <Gift className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    Special Offers
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Don't miss out on our amazing deals and limited-time offers
                </p>
                <Button 
                  size="xl"
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  View All Offers
                </Button>
              </div>
            </div>
          </div>

          {/* Promotional cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Promo Card 1 */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">20%</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">First Order Discount</h3>
                <p className="text-gray-600 mb-6">Get 20% off your first order when you sign up today</p>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Claim Now
                </Button>
              </div>
            </div>

            {/* Promo Card 2 */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Delivery</h3>
                <p className="text-gray-600 mb-6">Free delivery on orders over ₱500. No minimum spending required</p>
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Order Now
                </Button>
              </div>
            </div>

            {/* Promo Card 3 */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15 md:col-span-2 lg:col-span-1">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">⭐</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Loyalty Rewards</h3>
                <p className="text-gray-600 mb-6">Earn points with every order and get exclusive rewards</p>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Join Now
                </Button>
              </div>
            </div>
          </div>

          {/* Limited time offer banner */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 inline-block shadow-xl">
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">Limited Time: Offers valid until end of month!</span>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="container mx-auto px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Special Offers</h2>
        <p className="text-xl mb-8">Don't miss out on our amazing deals!</p>
        <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
          View Offers
        </Button>
      </div>
    </section>
  );
};

export default PromoBannersSection;