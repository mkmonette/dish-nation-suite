import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor, SectionConfig } from '@/lib/storage';
import { Plus, Star } from 'lucide-react';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface FeaturedProductsSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'modern-glass' | 'sleek-minimal';
  section?: SectionConfig;
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  vendor,
  menuItems,
  onAddToCart,
  template,
  section,
}) => {
  const featuredItems = menuItems.slice(0, 6);

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 inline-block shadow-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Featured Dishes
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our most popular and chef-recommended dishes
              </p>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glass card with hover effects */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15">
                  {/* Product image */}
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    <img
                      src={item.image || getDefaultPlaceholder('food')}
                      alt={item.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-400/90 text-yellow-900 backdrop-blur-sm">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description || 'Delicious and freshly prepared'}
                      </p>
                    </div>

                    {/* Price and add button */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-indigo-600">
                        ₱{item.price.toFixed(2)}
                      </div>
                      <Button
                        onClick={() => onAddToCart(item)}
                        size="sm"
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Floating decoration */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* View all button */}
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-gray-900 hover:bg-white/20 rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              View Full Menu
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