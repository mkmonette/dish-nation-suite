import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuCategory } from '@/lib/storage';
import { Utensils } from 'lucide-react';

interface CategoriesSectionProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  template: 'modern' | 'classic' | 'minimal';
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  template,
}) => {
  if (categories.length === 0) return null;

  if (template === 'modern') {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Browse Categories
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedCategory === 'all' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
              }`}
              onClick={() => onCategoryChange('all')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm">All Items</h3>
              </CardContent>
            </Card>
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedCategory === category.name ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === 'classic') {
    return (
      <section className="py-16 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-foreground">Menu Categories</h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-0.5 bg-primary"></div>
              <div className="w-3 h-3 bg-primary rotate-45"></div>
              <div className="w-12 h-0.5 bg-primary"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                selectedCategory === 'all' ? 'border-primary bg-primary/5' : 'border-primary/20 hover:border-primary/40'
              }`}
              onClick={() => onCategoryChange('all')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-base text-foreground">All Items</h3>
              </CardContent>
            </Card>
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                  selectedCategory === category.name ? 'border-primary bg-primary/5' : 'border-primary/20 hover:border-primary/40'
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                    <Utensils className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-foreground">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Minimal template
  return (
    <section className="py-16 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extralight text-primary tracking-wider mb-8">Categories</h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-8"></div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <Card 
            className={`cursor-pointer transition-all duration-300 hover:shadow-sm border ${
              selectedCategory === 'all' ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-border/40'
            }`}
            onClick={() => onCategoryChange('all')}
          >
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 border border-primary/20 rounded-full flex items-center justify-center">
                <Utensils className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-extralight tracking-wider text-sm text-foreground">All</h3>
            </CardContent>
          </Card>
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-sm border ${
                selectedCategory === category.name ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-border/40'
              }`}
              onClick={() => onCategoryChange(category.name)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 border border-primary/20 rounded-full flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-extralight tracking-wider text-sm text-foreground">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;