import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, Star, Heart, ShoppingCart } from 'lucide-react';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import EmptySection from './EmptySection';

interface FeaturedProductsSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'modern-glass';
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  vendor,
  menuItems,
  onAddToCart,
  template,
}) => {
  const featuredItems = menuItems.slice(0, 6);

  if (template === 'modern-glass') {
    if (featuredItems.length === 0) {
      return <EmptySection sectionName="Featured Products" message="Add menu items to showcase your best dishes" />;
    }
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured Dishes
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover our most popular and chef-recommended dishes
            </p>
          </div>

          {/* Mobile-first swipeable cards */}
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
            {featuredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="flex-shrink-0 w-80 md:w-full snap-start group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Modern card with glass effect */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/10">
                  {/* Product image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image || getDefaultPlaceholder('food')}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                    
                    {/* Interactive overlays */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {/* Popular badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {item.description || 'Delicious and freshly prepared with premium ingredients'}
                      </p>
                    </div>

                    {/* Price and add button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        ₱{item.price.toFixed(2)}
                      </div>
                      <Button
                        onClick={() => onAddToCart(item)}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-2xl px-6 py-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-12">
            <Button 
              size="xl"
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-white rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-xl"
            >
              Explore Full Menu
              <Plus className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">₱{item.price.toFixed(2)}</span>
                <Button onClick={() => onAddToCart(item)} size="sm">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;