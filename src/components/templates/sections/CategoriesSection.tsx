import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuCategory } from '@/lib/storage';
import { Utensils, Sparkles, Zap, Crown } from 'lucide-react';

interface CategoriesSectionProps {
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  template: 'future' | 'neo' | 'premium' | 'modern';
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  template,
}) => {
  if (categories.length === 0) return null;

  if (template === 'future') {
    return (
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Categories
            </h2>
            <div className="w-16 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground">Explore our futuristic menu</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <Card 
              className={`cursor-pointer transition-all duration-500 hover:scale-105 backdrop-blur-sm border ${
                selectedCategory === 'all' 
                  ? 'ring-2 ring-primary bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50' 
                  : 'bg-card/50 border-primary/20 hover:bg-card/70 hover:border-primary/40'
              }`}
              onClick={() => onCategoryChange('all')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-sm">All Items</h3>
              </CardContent>
            </Card>
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-500 hover:scale-105 backdrop-blur-sm border ${
                  selectedCategory === category.name 
                    ? 'ring-2 ring-primary bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50' 
                    : 'bg-card/50 border-primary/20 hover:bg-card/70 hover:border-primary/40'
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow">
                    <Utensils className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-sm">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === 'neo') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">MENU CATEGORIES</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-primary"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 shadow-lg ${
                selectedCategory === 'all' 
                  ? 'border-primary bg-gradient-to-br from-primary/20 to-secondary/20 shadow-primary/25' 
                  : 'border-primary/30 hover:border-primary shadow-md hover:shadow-lg'
              }`}
              onClick={() => onCategoryChange('all')}
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-black text-base text-foreground">ALL ITEMS</h3>
              </CardContent>
            </Card>
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 border-2 shadow-lg ${
                  selectedCategory === category.name 
                    ? 'border-primary bg-gradient-to-br from-primary/20 to-secondary/20 shadow-primary/25' 
                    : 'border-primary/30 hover:border-primary shadow-md hover:shadow-lg'
                }`}
                onClick={() => onCategoryChange(category.name)}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-black text-base text-foreground uppercase">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Premium template
  return (
    <section className="py-24 border-y border-primary/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Our Collections</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground font-light max-w-md mx-auto">Carefully curated selections for the discerning palate</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 max-w-6xl mx-auto">
          <Card 
            className={`cursor-pointer transition-all duration-700 hover:shadow-warm group ${
              selectedCategory === 'all' 
                ? 'border-2 border-primary/30 bg-primary/5 shadow-warm' 
                : 'border border-primary/10 hover:border-primary/20 hover:shadow-lg'
            }`}
            onClick={() => onCategoryChange('all')}
          >
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-6 border border-primary/20 rounded-full flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Crown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-light tracking-wider text-sm text-foreground">All Collections</h3>
            </CardContent>
          </Card>
          {categories.map((category) => (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-700 hover:shadow-warm group ${
                selectedCategory === category.name 
                  ? 'border-2 border-primary/30 bg-primary/5 shadow-warm' 
                  : 'border border-primary/10 hover:border-primary/20 hover:shadow-lg'
              }`}
              onClick={() => onCategoryChange(category.name)}
            >
              <CardContent className="p-8 text-center">
                <div className="w-12 h-12 mx-auto mb-6 border border-primary/20 rounded-full flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-light tracking-wider text-sm text-foreground">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;