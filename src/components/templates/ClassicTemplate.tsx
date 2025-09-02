import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
import { Plus, Utensils, Award, Heart, ImageIcon } from 'lucide-react';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import VendorLogo from '@/components/VendorLogo';

interface ClassicTemplateProps {
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

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#8b5a3c',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d4af37',
    '--accent-color': vendor.storefront?.colors?.accent || '#c41e3a',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={customStyle}>
      {headerComponent}
      
      {/* Classic Hero Section with Banner */}
      <section className="relative bg-card border-b-4 border-primary/20 min-h-[50vh] md:min-h-[60vh] flex items-center">
        {vendor.storefront?.banner && (
          <div className="absolute inset-0 opacity-20">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-card/80"></div>
          </div>
        )}
        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="mb-4">
                <VendorLogo 
                  vendor={vendor}
                  size="xl"
                  showFallback={true}
                  variant="rounded"
                  className="mx-auto"
                />
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

      {/* About Us Section */}
      {vendor.storefront?.aboutUs && (
        <section className="py-16 bg-muted/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                Our Story
              </h2>
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-0.5 bg-primary"></div>
                <div className="w-3 h-3 bg-primary rotate-45"></div>
                <div className="w-12 h-0.5 bg-primary"></div>
              </div>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="whitespace-pre-wrap font-light leading-relaxed">
                  {vendor.storefront.aboutUs}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Values Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">What Makes Us Special</h2>
            <p className="text-xl text-muted-foreground">Tradition, quality, and exceptional service</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">Only the finest ingredients and time-honored recipes create our exceptional dishes.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Made with Care</h3>
              <p className="text-muted-foreground leading-relaxed">Every dish is crafted with passion and attention to detail that you can taste.</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Utensils className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Traditional Methods</h3>
              <p className="text-muted-foreground leading-relaxed">Time-tested techniques passed down through generations of culinary expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mx-8">Our Menu</h2>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
          </div>
          <p className="text-xl text-muted-foreground">Crafted with passion, served with pride</p>
        </div>
        
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-16">
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
        )}
        
        {menuItems.length === 0 ? (
          <Card className="max-w-lg mx-auto border-2 border-dashed border-primary/30">
            <CardContent className="py-20 text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center">
                <Utensils className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-foreground">Our Menu is Being Prepared</h2>
              <p className="text-muted-foreground text-lg">
                We're carefully crafting our selection with the finest traditions in mind.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-20">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-12">
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">
                    {category}
                  </h3>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-16 h-0.5 bg-primary"></div>
                    <div className="w-3 h-3 bg-primary rotate-45"></div>
                    <div className="w-16 h-0.5 bg-primary"></div>
                  </div>
                </div>
                
                <div className="space-y-6 max-w-5xl mx-auto">
                  {items.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-48 h-48 md:h-32 bg-gradient-to-br from-muted to-muted/50 flex-shrink-0 relative overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                              <ImageIcon className="h-12 w-12 text-primary/30" />
                            </div>
                          )}
                          <Badge 
                            variant={item.available ? 'default' : 'secondary'}
                            className="absolute top-3 right-3 font-serif"
                          >
                            {item.available ? 'Available' : 'Sold Out'}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between p-8">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-2xl font-serif font-bold text-foreground mb-2">
                                {item.name}
                              </h4>
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {item.description}
                              </p>
                            </div>
                            <span className="text-3xl font-serif font-bold text-primary ml-6">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <Button 
                              variant="outline"
                              size="lg"
                              onClick={() => onAddToCart(item)}
                              disabled={!item.available}
                              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif px-8 py-3"
                            >
                              <Plus className="h-5 w-5 mr-2" />
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

      {/* Footer Section */}
      <footer className="bg-card/80 backdrop-blur-sm border-t-2 border-primary/20 py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
            <div className="lg:col-span-2">
              <VendorLogo vendor={vendor} size="lg" className="mx-auto lg:mx-0 mb-6" />
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-md">
                {vendor.description || "Bringing you the finest culinary experience with traditional flavors and modern excellence."}
              </p>
              <div className="flex justify-center lg:justify-start gap-4">
                <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 cursor-pointer transition-all duration-300 hover:scale-110">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center hover:bg-primary/20 cursor-pointer transition-all duration-300 hover:scale-110">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-xl text-foreground mb-6">Quick Links</h4>
              <div className="space-y-3">
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors text-lg">Our Menu</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors text-lg">About Us</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors text-lg">Contact</p>
                <p className="text-muted-foreground hover:text-primary cursor-pointer transition-colors text-lg">Reviews</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-serif font-bold text-xl text-foreground mb-6">Hours & Service</h4>
              <div className="space-y-3 text-muted-foreground">
                <p>Monday - Friday: 11:30 AM - 9:30 PM</p>
                <p>Saturday - Sunday: 12:00 PM - 10:00 PM</p>
                <p className="text-primary font-semibold">Traditional Dining & Takeout</p>
              </div>
            </div>
          </div>
          
          <div className="border-t-2 border-primary/20 mt-12 pt-8 text-center">
            <p className="text-muted-foreground text-lg">
              © 2024 {vendor.name}. Crafted with care and tradition.
            </p>
          </div>
        </div>
      </footer>

      {cartComponent}
    </div>
  );
};

export default ClassicTemplate;