import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, ImageIcon, Crown } from 'lucide-react';

interface FeaturedProductsSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'basic' | 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({ 
  vendor, 
  menuItems, 
  onAddToCart, 
  template 
}) => {
  // Template 1: Minimalist Grid (future)
  if (template === 'future') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
              Featured Items
            </h2>
            <div className="w-12 h-px bg-gray-400 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.slice(0, 3).map((item) => (
              <div key={item.id} className="group">
                <div className="aspect-square bg-gray-50 mb-4 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🍽️</span>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-light text-lg text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="font-light text-gray-900">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCart(item)}
                      className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 2: Visual Showcase (neo)
  if (template === 'neo') {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Signature Showcase
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our most celebrated dishes, crafted to perfection
            </p>
          </div>
          
          {/* Horizontal Carousel Layout */}
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-6 min-w-max">
              {menuItems.map((item) => (
                <Card key={item.id} className="w-80 flex-shrink-0 group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                    <span className="text-5xl opacity-40">🍽️</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-xl text-blue-600">
                          ${item.price.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => onAddToCart(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Template 3: Storytelling Layout (premium)
  if (template === 'premium') {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-4 border-2 border-amber-400/30 rounded-lg mb-8">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-400">
                Signature Collection
              </h2>
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed">
              Each dish represents our culinary heritage, crafted with passion and served with pride
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-amber-400/20 rounded-lg p-6 hover:border-amber-400/40 transition-colors group">
                <div className="aspect-video bg-gradient-to-br from-amber-100/10 to-amber-200/5 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl opacity-40">🍽️</span>
                </div>
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-xl text-white group-hover:text-amber-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-xl text-amber-400">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => onAddToCart(item)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                    >
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 4: Contemporary (modern)
  if (template === 'modern') {
    return (
      <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Contemporary Favorites
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Modern culinary artistry meets exceptional flavor
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <span className="text-4xl opacity-40">🍽️</span>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-xl text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-xl text-emerald-600">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => onAddToCart(item)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 5: Traditional (classic)
  if (template === 'classic') {
    return (
      <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-px bg-amber-600"></div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900">
                Heritage Collection
              </h2>
              <div className="w-16 h-px bg-amber-600"></div>
            </div>
            <p className="text-amber-800 max-w-3xl mx-auto text-lg font-serif italic leading-relaxed">
              Time-honored recipes passed down through generations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.slice(0, 6).map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-sm border border-amber-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl opacity-40">🍽️</span>
                </div>
                <div className="space-y-4">
                  <h3 className="font-serif font-semibold text-xl text-amber-900 group-hover:text-amber-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-xl text-amber-700">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => onAddToCart(item)}
                      className="bg-amber-700 hover:bg-amber-800 text-white font-serif"
                    >
                      Add to Order
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 6: Ultra Clean (minimal)
  if (template === 'minimal') {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-extralight text-black tracking-wider mb-4">
              Featured Selection
            </h2>
            <div className="flex items-center justify-center space-x-6">
              <div className="w-8 h-px bg-black"></div>
              <div className="w-2 h-2 border border-black rotate-45"></div>
              <div className="w-8 h-px bg-black"></div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            {menuItems.slice(0, 6).map((item) => (
              <div key={item.id} className="border-b border-gray-100 pb-8 last:border-b-0 group">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-light text-xl text-black mb-2 group-hover:text-gray-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right ml-6">
                    <div className="font-light text-xl text-black mb-3">
                      ${item.price.toFixed(2)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAddToCart(item)}
                      className="border-b-2 border-black rounded-none hover:bg-transparent hover:border-gray-600 px-0 py-1 font-light tracking-wider"
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Template 7: Colorful & Dynamic (vibrant)
  if (template === 'vibrant') {
    return (
      <section className="py-20 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-orange-400 rounded-full blur-lg opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              🌈 FEATURED EXPLOSION! 🌈
            </h2>
            <p className="text-xl md:text-2xl font-bold text-white max-w-3xl mx-auto leading-relaxed">
              VIBRANT FLAVORS THAT WILL BLOW YOUR MIND!
            </p>
            <div className="flex items-center justify-center space-x-4 mt-6">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {menuItems.slice(0, 6).map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 group hover:scale-105"
                style={{
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 2}deg)`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="aspect-video bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>🍽️</span>
                  <div className="absolute top-2 right-2">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black text-xl text-purple-800 group-hover:text-pink-600 transition-colors uppercase tracking-wide">
                    {item.name}
                  </h3>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-black text-2xl text-purple-600">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => onAddToCart(item)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-sm px-6 py-3 rounded-full shadow-lg transform hover:scale-110 transition-all"
                    >
                      🚀 ADD!
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Default fallback (should not reach here with proper template routing)
  return null;
};

export default FeaturedProductsSection;