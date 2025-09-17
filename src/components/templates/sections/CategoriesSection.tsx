import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { MenuCategory } from '@/lib/storage';
import { Grid, Filter } from 'lucide-react';
import EmptySection from './EmptySection';

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
    if (categories.length === 0) {
      return <EmptySection sectionName="Categories" message="Add menu categories to organize your dishes" />;
    }
    return (
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>
            <p className="text-gray-400 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter dishes by category
            </p>
          </div>

          {/* Mobile-first horizontal scroll */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={`flex-shrink-0 snap-start px-6 py-3 rounded-2xl border transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-xl shadow-blue-500/25'
                    : 'bg-white/5 backdrop-blur-xl border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-medium">{category.name}</span>
                {selectedCategory === category.name && (
                  <div className="w-2 h-2 bg-white/80 rounded-full ml-2 inline-block animate-pulse"></div>
                )}
              </button>
            ))}
          </div>

          {/* Desktop grid layout (hidden on mobile) */}
          <div className="hidden lg:grid grid-cols-4 xl:grid-cols-6 gap-4 mt-8">
            {categories.map((category, index) => (
              <button
                key={`desktop-${category.id}`}
                onClick={() => onCategoryChange(category.name)}
                className={`group relative h-24 rounded-2xl border transition-all duration-500 hover:scale-105 ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-transparent shadow-xl'
                    : 'bg-white/5 backdrop-blur-xl border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-3">
                  <Grid className="w-5 h-5 mb-2 opacity-60" />
                  <span className="font-medium text-center text-sm leading-tight">
                    {category.name}
                  </span>
                </div>

                {/* Active indicator */}
                {selectedCategory === category.name && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
                )}
              </button>
            ))}
          </div>

          {/* Active category display */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300 font-medium text-sm">
                Active: {categories.find(c => c.name === selectedCategory)?.name || 'All Categories'}
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