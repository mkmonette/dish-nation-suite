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
  template: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
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

  if (template === 'modern') {
    return (
      <main className="container mx-auto px-4 py-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground mb-4">
            Our Menu
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Thoughtfully crafted dishes that celebrate flavor and creativity
          </p>
        </div>

        {/* Modern category navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-muted/20'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border border-muted/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu items in clean grid layout */}
        <div className="max-w-6xl mx-auto">
          {selectedCategory === 'all' ? (
            Object.entries(categorizedItems).map(([categoryId, items]) => {
              const category = categories.find(c => c.id === categoryId);
              if (!category || items.length === 0) return null;
              
              return (
                <section key={categoryId} className="mb-20 last:mb-0">
                  <div className="flex items-center gap-4 mb-12">
                    <h3 className="text-xl font-medium text-foreground tracking-wide">
                      {category.name}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-muted/30 to-transparent"></div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="group relative bg-card/40 rounded-2xl p-6 border border-muted/10 hover:border-muted/30 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="flex gap-6">
                          {item.image && (
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted/20">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h4 className="text-lg font-semibold text-foreground leading-tight">
                                {item.name}
                              </h4>
                              <div className="text-lg font-semibold text-primary whitespace-nowrap">
                                ${item.price.toFixed(2)}
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                              {item.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant={item.available ? "outline" : "secondary"}
                                className="text-xs font-medium border-muted/30"
                              >
                                {item.available ? 'Available' : 'Unavailable'}
                              </Badge>
                              
                              <Button 
                                size="sm"
                                onClick={() => onAddToCart(item)}
                                disabled={!item.available}
                                className="h-9 px-4 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-card/40 rounded-2xl p-6 border border-muted/10 hover:border-muted/30 hover:bg-card/60 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex gap-6">
                    {item.image && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted/20">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h4 className="text-lg font-semibold text-foreground leading-tight">
                          {item.name}
                        </h4>
                        <div className="text-lg font-semibold text-primary whitespace-nowrap">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={item.available ? "outline" : "secondary"}
                          className="text-xs font-medium border-muted/30"
                        >
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                        
                        <Button 
                          size="sm"
                          onClick={() => onAddToCart(item)}
                          disabled={!item.available}
                          className="h-9 px-4 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

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
          <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent relative z-10 leading-tight">
            Future Menu
          </h2>
          <p className="text-xl text-muted-foreground font-medium relative z-10">Advanced culinary experience awaits</p>
        </div>

        {menuItems.length === 0 ? (
          <Card className="max-w-lg mx-auto border-2 border-primary/30 bg-card/50 backdrop-blur-lg">
            <CardContent className="py-20 text-center">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-2xl">
                <Utensils className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-black mb-4 text-foreground">Menu Loading...</h2>
              <p className="text-muted-foreground text-lg">
                Initializing quantum culinary matrix
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-32">
            {Object.entries(categorizedItems).map(([category, items]) => (
              <section key={category} className="relative">
                <div className="text-center mb-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-full blur-2xl scale-150 opacity-50"></div>
                  <h3 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent relative z-10">
                    {category}
                  </h3>
                  <div className="flex items-center justify-center gap-4 relative z-10">
                    <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    <div className="w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse"></div>
                    <div className="w-16 h-1 bg-gradient-to-r from-secondary to-accent rounded-full"></div>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  {items.map((item, index) => (
                    <div key={item.id} className={`group ${index % 2 === 0 ? 'lg:justify-self-end' : 'lg:justify-self-start'}`}>
                      <div className="relative max-w-2xl">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        
                        <div className="relative backdrop-blur-lg bg-card/40 rounded-3xl border-2 border-primary/30 p-8 hover:border-secondary/50 transition-all duration-700 group-hover:scale-105">
                          <div className="flex flex-col lg:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-6">
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <h4 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors duration-500">
                                    {item.name}
                                  </h4>
                                  <Badge 
                                    variant={item.available ? 'default' : 'secondary'}
                                    className="bg-gradient-to-r from-primary to-secondary text-white border-0 font-bold text-xs"
                                  >
                                    {item.available ? 'ACTIVE' : 'OFFLINE'}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                                  {item.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-3xl md:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  <Button 
                                    variant="outline"
                                    size="lg"
                                    onClick={() => onAddToCart(item)}
                                    disabled={!item.available}
                                    className="border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all duration-300 font-bold text-base px-8 py-4 rounded-2xl"
                                  >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add
                                  </Button>
                                </div>
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
    <main className="container mx-auto px-8 py-24">
      <div className="text-center mb-20">
        <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Our Menu</h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
        <p className="text-muted-foreground font-light">Curated selections for the discerning palate</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-8 py-3 text-sm font-light tracking-wider transition-all duration-700 ${
            selectedCategory === 'all'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-8 py-3 text-sm font-light tracking-wider transition-all duration-700 ${
              selectedCategory === category.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory === 'all' ? (
        Object.entries(categorizedItems).map(([categoryId, items]) => {
          const category = categories.find(c => c.id === categoryId);
          if (!category || items.length === 0) return null;
          
          return (
            <section key={categoryId} className="mb-24">
              <h3 className="text-xl font-light text-foreground mb-12 tracking-wider text-center">
                {category.name}
              </h3>
              
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id} className="group border-b border-muted/10 pb-8 hover:border-primary/20 transition-colors duration-700">
                    <div className="flex items-start gap-8">
                      {item.image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between mb-3">
                          <h4 className="text-lg font-light text-foreground tracking-wide">
                            {item.name}
                          </h4>
                          <span className="text-lg font-light text-primary tracking-wider">
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
          );
        })
      ) : (
        <div className="space-y-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="group border-b border-muted/10 pb-8 hover:border-primary/20 transition-colors duration-700">
              <div className="flex items-start gap-8">
                {item.image && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-3">
                    <h4 className="text-lg font-light text-foreground tracking-wide">
                      {item.name}
                    </h4>
                    <span className="text-lg font-light text-primary tracking-wider">
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
      )}
    </main>
  );
};

export default MenuSection;