import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
import { Plus, Utensils, ImageIcon } from 'lucide-react';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import VendorLogo from '@/components/VendorLogo';

interface MinimalTemplateProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
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
    '--primary-color': vendor.storefront?.colors?.primary || '#000000',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#6b7280',
    '--accent-color': vendor.storefront?.colors?.accent || '#f3f4f6',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white" style={customStyle}>
      {headerComponent}
      
      {/* Minimal Hero Section with Banner */}
      <section className="border-b border-border/50 relative min-h-[50vh] md:min-h-[55vh] flex items-center">
        {vendor.storefront?.banner && (
          <div className="absolute inset-0 opacity-10">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/70"></div>
          </div>
        )}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="mb-8">
              <VendorLogo 
                vendor={vendor}
                size="xl"
                showFallback={true}
                variant="rounded"
                className="mx-auto opacity-90"
              />
            </div>
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

      {/* Philosophy Section */}
      <section className="py-24 border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-extralight mb-8 text-foreground tracking-wider">Our Philosophy</h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Simple ingredients, perfect execution, memorable experiences
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-1 h-16 bg-primary mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 text-foreground tracking-wide">Quality</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Sourced with care, crafted with precision
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-1 h-16 bg-primary mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 text-foreground tracking-wide">Simplicity</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Clean flavors, elegant presentation
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-1 h-16 bg-primary mx-auto mb-8"></div>
              <h3 className="text-xl font-light mb-4 text-foreground tracking-wide">Experience</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Every detail considered, every moment valued
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-extralight text-primary tracking-wider mb-8">Menu</h2>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground font-light">Thoughtfully curated selections</p>
        </div>
        
        {menuItems.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-24">
            <div className="w-24 h-24 mx-auto mb-12 border border-primary/20 rounded-full flex items-center justify-center">
              <Utensils className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-extralight mb-6 text-foreground tracking-wider">Menu Coming Soon</h3>
            <p className="text-muted-foreground font-light text-lg">We're curating our selection with care.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="space-y-16">
                <div className="text-center">
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-wide text-foreground mb-4">
                    {category}
                  </h3>
                  <div className="w-16 h-0.5 bg-primary mx-auto"></div>
                </div>
                
                <div className="max-w-3xl mx-auto space-y-12">
                  {items.map((item) => (
                    <div key={item.id} className="group">
                      <div className="flex items-start justify-between py-8 border-b border-border/20 hover:border-border/40 transition-all duration-500">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-baseline gap-4">
                            <h4 className="text-xl font-light text-foreground group-hover:text-primary transition-colors tracking-wide">
                              {item.name}
                            </h4>
                            <div className="flex-1 border-b border-dotted border-muted-foreground/20 mx-4 translate-y-[-4px]"></div>
                            <span className="text-xl font-light text-foreground tracking-wide">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-muted-foreground font-light leading-relaxed pr-8 max-w-2xl">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between pt-4">
                            <Badge 
                              variant={item.available ? "outline" : "secondary"}
                              className="text-xs border-muted-foreground/20 font-light"
                            >
                              {item.available ? 'Available' : 'Unavailable'}
                            </Badge>
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
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer Section */}
      <footer className="border-t border-border/30 py-20 bg-muted/5">
        <div className="container mx-auto px-4 text-center">
          <VendorLogo vendor={vendor} size="md" className="mx-auto mb-8" />
          <p className="text-muted-foreground font-light text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            {vendor.description || "Crafting exceptional experiences through thoughtful cuisine and dedicated service."}
          </p>
          <div className="w-24 h-0.5 bg-primary mx-auto mb-8"></div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-2xl mx-auto mb-12">
            <div>
              <h4 className="font-light text-foreground mb-4 tracking-wide">Hours</h4>
              <div className="space-y-2 text-muted-foreground font-light text-sm">
                <p>Mon - Fri: 11:00 - 22:00</p>
                <p>Sat - Sun: 12:00 - 23:00</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-light text-foreground mb-4 tracking-wide">Contact</h4>
              <div className="space-y-2 text-muted-foreground font-light text-sm">
                <p>Reserve or Order</p>
                <p>Fresh Daily</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-light text-foreground mb-4 tracking-wide">Service</h4>
              <div className="space-y-2 text-muted-foreground font-light text-sm">
                <p>Dine In</p>
                <p>Takeaway</p>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground font-light">
            © 2024 {vendor.name}. Thoughtfully crafted.
          </p>
        </div>
      </footer>

      {cartComponent}
    </div>
  );
};

export default MinimalTemplate;