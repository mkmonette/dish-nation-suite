import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, Utensils, Award, Heart } from 'lucide-react';

interface ClassicTemplateProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  cartItemCount: number;
  cartComponent: React.ReactNode;
  headerComponent: React.ReactNode;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#8b5a3c',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d4af37',
    '--accent-color': vendor.storefront?.colors?.accent || '#c41e3a',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={customStyle}>
      {headerComponent}
      
      {/* Classic Hero Section */}
      <section className="relative bg-card border-b-4 border-primary/20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <Utensils className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
                {vendor.storefront?.heroText || vendor.storeName}
              </h1>
              <div className="w-32 h-0.5 bg-primary mx-auto mb-6"></div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {vendor.storefront?.heroSubtext || vendor.description || 'Authentic flavors, timeless recipes, exceptional service'}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-sm">Premium Quality</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-sm">Made with Love</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-secondary/10 rounded-full flex items-center justify-center">
                  <Utensils className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="font-semibold text-sm">Traditional Recipes</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-12">
        {menuItems.length === 0 ? (
          <Card className="max-w-md mx-auto border-2 border-dashed border-muted">
            <CardContent className="py-12 text-center">
              <Utensils className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-serif font-semibold mb-2">Our Menu is Being Prepared</h2>
              <p className="text-muted-foreground">
                We're carefully crafting our menu. Please check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-16">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-foreground">
                    {category}
                  </h2>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-0.5 bg-primary"></div>
                    <div className="w-3 h-3 bg-primary rotate-45"></div>
                    <div className="w-12 h-0.5 bg-primary"></div>
                  </div>
                </div>
                
                <div className="space-y-4 max-w-4xl mx-auto">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-muted">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-32 h-32 sm:h-24 bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 relative">
                          <div className="absolute inset-0 bg-primary/5"></div>
                          <Badge 
                            variant={item.available ? 'default' : 'secondary'}
                            className="absolute top-2 right-2 text-xs"
                          >
                            {item.available ? '✓' : 'Out'}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 flex flex-col sm:flex-row justify-between p-6">
                          <div className="flex-1 mb-4 sm:mb-0 sm:pr-6">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-serif font-semibold text-foreground">
                                {item.name}
                              </h3>
                              <span className="text-xl font-bold text-primary ml-4">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => onAddToCart(item)}
                              disabled={!item.available}
                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Order
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
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

export default ClassicTemplate;