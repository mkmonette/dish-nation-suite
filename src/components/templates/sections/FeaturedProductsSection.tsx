import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MenuItem, Vendor } from '@/lib/storage';
import { Plus, ImageIcon, Zap, Sparkles, Crown } from 'lucide-react';

interface FeaturedProductsSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'future' | 'neo' | 'premium';
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  vendor,
  menuItems,
  onAddToCart,
  template,
}) => {
  if (menuItems.length === 0) {
    if (template === 'future') {
      return (
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Featured Items
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our signature dishes will be featured here soon. Check back later for our chef's special recommendations!
              </p>
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
              <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">FEATURED ITEMS</h2>
              <div className="flex justify-center">
                <div className="w-32 h-1 bg-gradient-primary"></div>
              </div>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
                Bold flavors coming soon. Stay tuned for our signature selections!
              </p>
            </div>
          </div>
        </section>
      );
    }
    
    // Premium template
    return (
      <section className="py-24 border-y border-primary/10">
        <div className="container mx-auto px-8">
          <div className="text-center">
            <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Featured Selections</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
            <p className="text-muted-foreground max-w-xl mx-auto font-light">
              Curated selections coming soon
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredItems = menuItems.slice(0, 6); // Show first 6 items as featured

  if (template === 'future') {
    return (
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Items
            </h2>
            <div className="w-16 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground">Experience the future of dining</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:scale-105 transition-all duration-500 backdrop-blur-sm bg-card/60 border border-primary/20 hover:border-primary/40 shadow-glow">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-secondary text-white border-0">
                    <Zap className="h-3 w-3 mr-1" />
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
                      className="rounded-full shadow-glow hover:shadow-glow transition-all duration-300"
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

  if (template === 'neo') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">FEATURED ITEMS</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-primary"></div>
            </div>
            <p className="text-lg text-muted-foreground mt-4 font-bold">BOLD FLAVORS. MODERN STYLE.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredItems.map((item) => (
              <Card key={item.id} className="group overflow-hidden hover:scale-105 transition-all duration-300 border-2 border-primary/30 hover:border-primary shadow-lg hover:shadow-primary/25">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 relative overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                      <ImageIcon className="h-12 w-12 text-primary/40" />
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground font-black">
                    FEATURED
                  </Badge>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors font-black uppercase tracking-wider">
                    {item.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                    <Button 
                      variant="hero"
                      size="sm"
                      onClick={() => onAddToCart(item)}
                      disabled={!item.available}
                      className="font-black uppercase tracking-wider"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      ADD
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

  // Premium template
  return (
    <section className="py-24 border-y border-primary/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Featured Selections</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground font-light max-w-md mx-auto">Meticulously curated for the discerning palate</p>
        </div>
        
        <div className="max-w-5xl mx-auto space-y-12">
          {featuredItems.map((item) => (
            <div key={item.id} className="group">
              <div className="flex items-center justify-between py-8 border-b border-primary/10 hover:border-primary/20 transition-all duration-700">
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 relative overflow-hidden rounded-lg border border-primary/10">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Crown className="h-6 w-6 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xl font-light text-foreground group-hover:text-primary transition-colors tracking-wide">
                        {item.name}
                      </h4>
                      <Badge variant="outline" className="text-xs border-primary/30 font-light">
                        Featured
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <span className="text-2xl font-light text-foreground tracking-wide">
                    ${item.price.toFixed(2)}
                  </span>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => onAddToCart(item)}
                    disabled={!item.available}
                    className="border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-light tracking-wider px-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
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