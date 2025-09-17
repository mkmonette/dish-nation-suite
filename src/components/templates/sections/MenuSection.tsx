import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
import { Plus, Search, Filter, ShoppingCart, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import EmptySection from './EmptySection';

interface MenuSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'modern-glass';
}

const MenuSection: React.FC<MenuSectionProps> = ({
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  template,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Filter items based on category and search
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (template === 'modern-glass') {
    if (menuItems.length === 0) {
      return <EmptySection sectionName="Full Menu" message="Add menu items to display your complete catalog" />;
    }
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Complete Menu
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Explore our carefully crafted dishes made with the finest ingredients
            </p>
          </div>

          {/* Modern search bar */}
          <div className="mb-12">
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search delicious dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 pr-5 bg-white/5 backdrop-blur-xl border-white/20 rounded-2xl h-16 text-white placeholder-gray-400 focus:bg-white/10 focus:border-white/30 transition-all duration-300 text-lg"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Menu items grid */}
          <div className="space-y-12">
            {categories
              .filter(category => category.name !== 'all')
              .map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category.name);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-8">
                    {/* Category header */}
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {category.name}
                        </span>
                      </h3>
                      <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
                    </div>

                    {/* Items grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map((item, index) => (
                        <div 
                          key={item.id}
                          className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          {/* Item image */}
                          <div className="relative mb-6 overflow-hidden rounded-2xl">
                            <img
                              src={item.image || getDefaultPlaceholder('food')}
                              alt={item.name}
                              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>

                          {/* Item details */}
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {item.description}
                                </p>
                              )}
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

                            {/* Variations indicator */}
                            {(item.variations?.length > 0 || item.addOns?.length > 0) && (
                              <div className="text-xs text-gray-500 italic">
                                Customizable options available
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 inline-block shadow-xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    onCategoryChange('all');
                  }}
                  className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl"
                >
                  View All Items
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg shadow-md p-6">
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

export default MenuSection;