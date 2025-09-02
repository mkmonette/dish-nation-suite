import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
import { Plus, MapPin, Clock, Star, ImageIcon, Utensils } from 'lucide-react';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import VendorLogo from '@/components/VendorLogo';

interface ModernTemplateProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  cartItemCount: number;
  cartComponent: React.ReactNode;
  headerComponent: React.ReactNode;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  cartComponent,
  headerComponent,
}) => {
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const categorizedItems = filteredItems.reduce((acc, item) => {
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
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground min-h-[60vh] md:min-h-[70vh] flex items-center">
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-none"></div>
          </div>
        )}
        {!vendor.storefront?.banner && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-secondary"></div>
        )}
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <VendorLogo 
                vendor={vendor}
                size="2xl"
                showFallback={true}
                variant="rounded"
                className="mx-auto"
              />
            </div>
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

      {/* Features Section */}
      <section className="py-20 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-lg text-muted-foreground">Excellence in every aspect</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 border-0 bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and reliable service to your doorstep</p>
            </Card>
            
            <Card className="text-center p-8 border-0 bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-white fill-current" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Premium Quality</h3>
              <p className="text-muted-foreground">Fresh ingredients and exceptional taste</p>
            </Card>
            
            <Card className="text-center p-8 border-0 bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">Local Service</h3>
              <p className="text-muted-foreground">Supporting our community with care</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Menu
          </h2>
          <p className="text-lg text-muted-foreground">Discover our delicious selection</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4"></div>
        </div>
        
        {menuItems.length === 0 ? (
          <Card className="max-w-lg mx-auto border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Utensils className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Menu Coming Soon</h3>
              <p className="text-muted-foreground text-lg">
                We're carefully crafting our selection of amazing dishes
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-20">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-12">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    {category}
                  </h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {items.map((item) => (
                    <Card key={item.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                      <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <ImageIcon className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge 
                            variant={item.available ? 'default' : 'secondary'}
                            className="mb-2 bg-white/90 text-black"
                          >
                            {item.available ? 'Available' : 'Sold Out'}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-muted-foreground">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ${item.price.toFixed(2)}
                          </span>
                          <Button 
                            variant="hero"
                            size="sm"
                            onClick={() => onAddToCart(item)}
                            disabled={!item.available}
                            className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
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

      {/* Footer Section */}
      <footer className="bg-card/80 backdrop-blur-sm border-t py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left">
            <div className="lg:col-span-2">
              <VendorLogo vendor={vendor} size="lg" className="mx-auto lg:mx-0 mb-6" />
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
                {vendor.description || "Experience exceptional flavors and outstanding service. We're committed to bringing you the finest dining experience."}
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all duration-300">
                  <Star className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-white cursor-pointer transition-all duration-300">
                  <MapPin className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6">Quick Links</h4>
              <div className="space-y-3">
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Menu</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">About</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Contact</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">Reviews</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-6">Service Hours</h4>
              <div className="space-y-3 text-muted-foreground">
                <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
                <p>Sat - Sun: 12:00 PM - 11:00 PM</p>
                <p className="text-primary font-medium">Delivery Available</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/20 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2024 {vendor.name}. Crafted with passion and delivered with care.
            </p>
          </div>
        </div>
      </footer>

      {cartComponent}
    </div>
  );
};

export default ModernTemplate;