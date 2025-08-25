import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, Circle } from 'lucide-react';

interface MinimalTemplateProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem) => void;
  cartItemCount: number;
  cartComponent: React.ReactNode;
  headerComponent: React.ReactNode;
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
  vendor,
  menuItems,
  onAddToCart,
  cartComponent,
  headerComponent,
}) => {
  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#000000',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#6b7280',
    '--accent-color': vendor.storefront?.colors?.accent || '#f3f4f6',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white" style={customStyle}>
      {headerComponent}
      
      {/* Minimal Hero Section with Banner */}
      <section className="border-b border-border/50 relative">
        {vendor.storefront?.banner && (
          <div className="absolute inset-0 opacity-5">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            {vendor.storefront?.logo && (
              <div className="mb-8">
                <img 
                  src={vendor.storefront.logo} 
                  alt={`${vendor.storeName} logo`}
                  className="h-12 md:h-16 mx-auto object-contain opacity-90"
                />
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground">
              {vendor.storefront?.heroText || vendor.storeName}
            </h1>
            <div className="w-16 h-px bg-foreground mx-auto"></div>
            <p className="text-lg text-muted-foreground font-light leading-relaxed">
              {vendor.storefront?.heroSubtext || vendor.description || 'Simple. Fresh. Delicious.'}
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      {vendor.storefront?.aboutUs && (
        <section className="py-20 border-b border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
                About
              </h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                  {vendor.storefront.aboutUs}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-16">
        {menuItems.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20">
            <Circle className="h-8 w-8 mx-auto text-muted-foreground mb-6" />
            <h2 className="text-xl font-light mb-3">Menu in preparation</h2>
            <p className="text-muted-foreground font-light">
              We're curating something special
            </p>
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-12">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
                    {category}
                  </h2>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-8">
                  {items.map((item, index) => (
                    <div key={item.id} className="group">
                      <div className="flex items-start justify-between py-6 border-b border-border/30 hover:border-border transition-colors duration-300">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/30 mx-3 translate-y-[-2px]"></div>
                            <span className="text-lg font-medium text-foreground">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground font-light pr-4">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <Badge 
                              variant={item.available ? "outline" : "secondary"}
                              className="text-xs border-muted-foreground/30"
                            >
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
                            <Button 
                              variant="ghost"
                              size="sm"
                              onClick={() => onAddToCart(item)}
                              disabled={!item.available}
                              className="text-xs font-light h-8 px-3 hover:bg-muted/30 hover:text-foreground"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {cartComponent}
    </div>
  );
};

export default MinimalTemplate;