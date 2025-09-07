import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuCategory } from '@/lib/storage';

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
          
          <ScrollArea className="w-full">
            <div className="flex justify-center space-x-4 pb-4">
              <Button
                variant={selectedCategory === 'all' ? 'hero' : 'outline'}
                onClick={() => onCategoryChange('all')}
                className="whitespace-nowrap rounded-full"
              >
                All Items
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'hero' : 'outline'}
                  onClick={() => onCategoryChange(category.name)}
                  className="whitespace-nowrap rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
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
          
          <ScrollArea className="w-full">
            <div className="flex justify-center space-x-6 pb-4">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => onCategoryChange('all')}
                className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif text-base px-8 py-3"
              >
                All Items
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? 'default' : 'outline'}
                  onClick={() => onCategoryChange(category.name)}
                  className="whitespace-nowrap border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif text-base px-8 py-3"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </section>
    );
  }

  // Minimal template
  return (
    <section className="py-16 border-b border-border/30">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex justify-center space-x-8 pb-4">
            <Button
              variant={selectedCategory === 'all' ? 'ghost' : 'ghost'}
              onClick={() => onCategoryChange('all')}
              className={`whitespace-nowrap font-light tracking-wider border-b-2 rounded-none pb-2 ${
                selectedCategory === 'all' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => onCategoryChange(category.name)}
                className={`whitespace-nowrap font-light tracking-wider border-b-2 rounded-none pb-2 ${
                  selectedCategory === category.name 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
};

export default CategoriesSection;