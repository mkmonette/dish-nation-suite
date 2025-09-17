import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { MenuCategory } from '@/lib/storage';

interface CategoriesSectionProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  template: 'modern-glass';
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  template,
}) => {
  if (template === 'modern-glass') {
    return (
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Browse Categories
              </span>
            </h2>
            <p className="text-lg text-gray-600">Find exactly what you're craving</p>
          </div>

          {/* Categories carousel/grid */}
          <div className="relative">
            {/* Mobile scroll container */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:hidden scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.name)}
                  className={`flex-shrink-0 min-w-[120px] h-16 rounded-2xl border transition-all duration-300 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
                      : 'bg-white/10 backdrop-blur-xl border-white/20 text-gray-700 hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <span className="font-semibold">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.name)}
                  className={`group relative h-20 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                    selectedCategory === category.name
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent shadow-xl scale-105'
                      : 'bg-white/10 backdrop-blur-xl border-white/20 text-gray-700 hover:bg-white/20 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Background decoration */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <span className="font-semibold text-center px-3">
                      {category.name}
                    </span>
                  </div>

                  {/* Floating indicator */}
                  {selectedCategory === category.name && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active category indicator */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 shadow-lg">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">
                Showing: {categories.find(c => c.name === selectedCategory)?.name || 'All Items'}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Categories</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => onCategoryChange(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;