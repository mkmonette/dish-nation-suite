import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
import { Plus, Utensils, ImageIcon } from 'lucide-react';

interface MenuSectionProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  template: 'future' | 'neo' | 'premium';
}

const MenuSection: React.FC<MenuSectionProps> = ({
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  template,
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

  if (template === 'future') {
    return (
      <main className="container mx-auto px-4 py-16 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 -right-20 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="text-center mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-3xl scale-150 opacity-30"></div>
          <div className="relative backdrop-blur-sm bg-card/20 rounded-3xl border border-primary/30 p-8 mx-auto max-w-2xl">
            <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Quantum Menu
            </h2>
            <p className="text-muted-foreground text-lg">Discover interdimensional flavors crafted with precision</p>
            <div className="flex justify-center items-center gap-4 mt-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 relative">
            <div className="inline-block p-8 backdrop-blur-lg bg-card/30 rounded-3xl border border-primary/20">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Quantum Menu Loading...
              </h3>
              <p className="text-muted-foreground">New culinary experiences materializing soon!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-20 relative">
            {Object.entries(categorizedItems).map(([category, items], categoryIndex) => (
              <section key={category} className="space-y-12">
                {/* Unique header design for each category */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-2xl"></div>
                  <div className="relative text-center py-8 backdrop-blur-sm bg-card/20 rounded-2xl border border-primary/30">
                    <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {category}
                    </h3>
                    <div className="flex justify-center items-center gap-4">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary rounded-full"></div>
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Alternating layouts per category */}
                {categoryIndex % 2 === 0 ? (
                  // Floating card layout for even categories
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className="relative group"
                        style={{ 
                          transform: `translateY(${index % 2 === 0 ? '0' : '2rem'})`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                        <Card className="relative overflow-hidden border-0 shadow-2xl bg-card/80 backdrop-blur-lg rounded-3xl group-hover:scale-105 transition-all duration-500">
                          <div className="aspect-[4/3] relative overflow-hidden rounded-t-3xl">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                <ImageIcon className="h-16 w-16 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4">
                              <Badge 
                                variant={item.available ? 'default' : 'secondary'}
                                className="bg-white/90 text-black border-0 shadow-lg"
                              >
                                {item.available ? '✓ Available' : '⏳ Sold Out'}
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <div className="bg-card/90 backdrop-blur-lg px-4 py-2 rounded-2xl border border-primary/30">
                                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-muted-foreground">
                              {item.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="pt-0">
                            <Button 
                              variant="default"
                              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              onClick={() => onAddToCart(item)}
                              disabled={!item.available}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add to Quantum Cart
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Horizontal showcase for odd categories
                  <div className="space-y-8">
                    {items.map((item, index) => (
                      <div 
                        key={item.id} 
                        className={`relative group ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-8 items-center`}
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                        <div className="relative flex-1 backdrop-blur-lg bg-card/40 rounded-3xl border border-primary/30 overflow-hidden">
                          <div className="p-8">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                  {item.name}
                                </h4>
                                <p className="text-muted-foreground mb-4">{item.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                  ${item.price.toFixed(2)}
                                </div>
                                <Badge 
                                  variant={item.available ? 'default' : 'secondary'}
                                  className="mt-2 bg-primary/10 border border-primary/30"
                                >
                                  {item.available ? 'Available' : 'Sold Out'}
                                </Badge>
                              </div>
                            </div>
                            <Button 
                              variant="default"
                              size="lg"
                              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                              onClick={() => onAddToCart(item)}
                              disabled={!item.available}
                            >
                              <Plus className="h-5 w-5 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                        <div className="relative lg:w-80 w-full">
                          <div className="aspect-square rounded-3xl overflow-hidden relative">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
                                <ImageIcon className="h-20 w-20 text-primary/40" />
                              </div>
                            )}
                            <div className="absolute inset-0 rounded-3xl border-2 border-primary/30 shadow-2xl"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    );
  }

  if (template === 'neo') {
    return (
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
    );
  }

  // Premium template
  return (
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
  );
};

export default MenuSection;