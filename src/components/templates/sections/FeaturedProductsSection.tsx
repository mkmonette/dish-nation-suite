import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, ImageIcon } from 'lucide-react';

interface FeaturedProductsSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'modern' | 'classic' | 'minimal';
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  vendor,
  menuItems,
  onAddToCart,
  template,
}) => {
  if (menuItems.length === 0) return null;

  const featuredItems = menuItems.slice(0, 6); // Show first 6 items as featured

  if (template === 'modern') {
    return (
      <section className="py-20 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Items
            </h2>
            <p className="text-lg text-muted-foreground">Our most popular dishes</p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredItems.map((item) => (
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
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
                    Featured
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {item.name}
                  </CardTitle>
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
                      className="rounded-full"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
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
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">Featured Selections</h2>
            <p className="text-xl text-muted-foreground">Curated favorites from our kitchen</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary/20">
                <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
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
                  <Badge className="absolute top-3 left-3 bg-secondary/90 text-secondary-foreground font-serif">
                    Featured
                  </Badge>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl font-serif font-bold text-foreground">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-serif font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button 
                      variant="outline"
                      onClick={() => onAddToCart(item)}
                      disabled={!item.available}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-serif"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
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
    <section className="py-24 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extralight text-primary tracking-wider mb-8">Featured</h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground font-light">Carefully selected highlights</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-12">
          {featuredItems.map((item) => (
            <div key={item.id} className="group">
              <div className="flex items-start justify-between py-8 border-b border-border/20 hover:border-border/40 transition-all duration-500">
                <div className="flex-1 space-y-3">
                  <div className="flex items-baseline gap-4">
                    <h4 className="text-xl font-light text-foreground group-hover:text-primary transition-colors tracking-wide">
                      {item.name}
                    </h4>
                    <Badge variant="outline" className="text-xs border-primary/30 font-light">
                      Featured
                    </Badge>
                    <div className="flex-1 border-b border-dotted border-muted-foreground/20 mx-4 translate-y-[-4px]"></div>
                    <span className="text-xl font-light text-foreground tracking-wide">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div></div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      onClick={() => onAddToCart(item)}
                      disabled={!item.available}
                      className="border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-light tracking-wider h-9 px-6"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;