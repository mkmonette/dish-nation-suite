import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, MapPin, Clock, Star } from 'lucide-react';

interface ModernTemplateProps {
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

const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" style={customStyle}>
      {headerComponent}
      
      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground">
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
          </div>
        )}
        {!vendor.storefront?.banner && <div className="absolute inset-0 bg-black/20"></div>}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {vendor.storefront?.logo && (
              <div className="mb-8">
                <img 
                  src={vendor.storefront.logo} 
                  alt={`${vendor.storeName} logo`}
                  className="h-20 md:h-24 mx-auto object-contain"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-1000">
              {vendor.storefront?.heroText || `Welcome to ${vendor.storeName}`}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8 animate-in slide-in-from-bottom-4 duration-1000 delay-200">
              {vendor.storefront?.heroSubtext || vendor.description || 'Delicious food delivered fresh to your door'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-4 duration-1000 delay-400">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">30-45 min</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">4.8 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      {vendor.storefront?.aboutUs && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Us
              </h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="whitespace-pre-wrap">{vendor.storefront.aboutUs}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-12">
        {menuItems.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">🍽️</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Menu Coming Soon</h2>
              <p className="text-muted-foreground">
                This store is setting up their menu. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {category}
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                      <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge 
                            variant={item.available ? 'default' : 'secondary'}
                            className="mb-2"
                          >
                            {item.available ? 'Available' : 'Sold Out'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <Button 
                            variant="hero"
                            size="sm"
                            onClick={() => onAddToCart(item)}
                            disabled={!item.available}
                            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
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

export default ModernTemplate;