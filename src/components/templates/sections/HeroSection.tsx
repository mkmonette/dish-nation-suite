import React from 'react';
import { Vendor } from '@/lib/storage';
import { MapPin, Clock, Star, Sparkles, Zap, Cpu, Heart } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';
import { Button } from '@/components/ui/enhanced-button';

interface HeroSectionProps {
  vendor: Vendor;
  template: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const HeroSection: React.FC<HeroSectionProps> = ({ vendor, template }) => {
  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;
  // Template 1: Minimalist Grid (future)
  if (template === 'future') {
    return (
      <section className="relative min-h-[50vh] bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-wide">
              {vendor.name}
            </h1>
            <div className="w-12 h-px bg-gray-400 mx-auto"></div>
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">
              {vendor.description || "Crafted with precision, served with care"}
            </p>
            <Button variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3">
              View Menu
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Template 2: Visual Showcase (neo)
  if (template === 'neo') {
    return (
      <section className="relative min-h-[80vh] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center w-full">
            <div className="text-white space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {vendor.name}
              </h1>
              <p className="text-xl md:text-2xl font-medium opacity-90">
                {vendor.description || "Visual excellence meets culinary mastery"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold">
                  Order Now
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Explore Menu
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <p className="text-lg font-medium">Featured Cuisine</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Template 3: Storytelling Layout (premium)
  if (template === 'premium') {
    return (
      <section className="relative min-h-[70vh] bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <div className="inline-block p-4 border-2 border-amber-400/30 rounded-lg">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-400">
                {vendor.name}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {vendor.description || "Where tradition meets innovation, creating unforgettable dining experiences"}
            </p>
            <div className="flex items-center justify-center space-x-4 pt-6">
              <div className="w-8 h-px bg-amber-400"></div>
              <span className="text-amber-400 text-2xl">✦</span>
              <div className="w-8 h-px bg-amber-400"></div>
            </div>
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8">
              Discover Our Story
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Template 4: Contemporary (modern)
  if (template === 'modern') {
    return (
      <section className="relative min-h-[75vh] bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-100/50 to-transparent" />
        <div className="container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                  Fresh • Local • Sustainable
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                  {vendor.name}
                </h1>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {vendor.description || "Modern cuisine with a contemporary twist, crafted for today's discerning palate"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Start Ordering
                </Button>
                <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Browse Menu
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-emerald-200 rounded-xl"></div>
                  <div className="aspect-video bg-emerald-100 rounded-xl"></div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="aspect-video bg-emerald-300 rounded-xl"></div>
                  <div className="aspect-square bg-emerald-150 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Template 5: Traditional (classic)
  if (template === 'classic') {
    return (
      <section className="relative min-h-[70vh] bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 53, 15, 0.03) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.03) 0%, transparent 50%)`
        }} />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-px bg-amber-600"></div>
                <span className="text-amber-600 text-3xl">❦</span>
                <div className="w-16 h-px bg-amber-600"></div>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-900">
                {vendor.name}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-amber-800 leading-relaxed font-serif italic">
              {vendor.description || "Preserving culinary traditions with authentic flavors and time-honored recipes"}
            </p>
            <div className="space-y-4">
              <Button size="lg" className="bg-amber-700 hover:bg-amber-800 text-white font-serif px-8">
                Explore Our Heritage
              </Button>
              <p className="text-sm text-amber-700">Est. Since Generations</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Template 6: Ultra Clean (minimal)
  if (template === 'minimal') {
    return (
      <section className="relative min-h-[60vh] bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-12 max-w-2xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl font-extralight text-black tracking-wider">
                {vendor.name}
              </h1>
              <div className="flex items-center justify-center space-x-6">
                <div className="w-8 h-px bg-black"></div>
                <div className="w-2 h-2 border border-black rotate-45"></div>
                <div className="w-8 h-px bg-black"></div>
              </div>
            </div>
            <p className="text-gray-600 text-base font-light leading-relaxed tracking-wide">
              {vendor.description || "Simplicity in form. Complexity in flavor."}
            </p>
            <div className="pt-8">
              <Button variant="ghost" className="border-b-2 border-black rounded-none hover:bg-transparent hover:border-gray-600 px-0 py-2 font-light tracking-wider">
                ENTER
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Template 7: Colorful & Dynamic (vibrant)
  if (template === 'vibrant') {
    return (
      <section className="relative min-h-[85vh] bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-orange-400 rounded-full blur-lg opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center text-white space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-8xl font-black tracking-tight">
                <span className="inline-block animate-bounce" style={{animationDelay: '0s'}}>{vendor.name.charAt(0)}</span>
                <span className="inline-block animate-bounce" style={{animationDelay: '0.1s'}}>{vendor.name.slice(1)}</span>
              </h1>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            <p className="text-xl md:text-3xl font-bold max-w-4xl mx-auto leading-relaxed">
              {vendor.description || "EXPLOSIVE FLAVORS! VIBRANT EXPERIENCES! UNFORGETTABLE MOMENTS!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all">
                🚀 BLAST OFF!
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-8 py-4 rounded-full">
                🌈 EXPLORE MENU
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return null;

  if (template === 'neo') {
    return (
      <section className="relative min-h-[75vh] flex items-center overflow-hidden" style={customStyle}>
        {vendor.storefront?.banner && (
          <div className="absolute inset-0">
            <img 
              src={vendor.storefront.banner} 
              alt="Store banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90"></div>
          </div>
        )}
        
        {/* Bold geometric shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/20 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/20 rotate-12 rounded-full"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-8">
                  <VendorLogo 
                    vendor={vendor}
                    size="xl"
                    showFallback={true}
                    variant="square"
                    className="border-4 border-primary"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 text-foreground leading-tight">
                  {vendor.storefront?.heroText || vendor.storeName}
                </h1>
                <div className="w-20 h-1 bg-gradient-primary mb-6"></div>
                <p className="text-xl text-muted-foreground mb-8 font-medium">
                  {vendor.storefront?.heroSubtext || vendor.description || 'Bold flavors. Modern style. Unforgettable experience.'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-card border-l-4 border-primary p-6 rounded-r-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="font-bold">Fast Delivery</span>
                  </div>
                </div>
                <div className="bg-card border-l-4 border-secondary p-6 rounded-r-lg shadow-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-secondary" />
                    <span className="font-bold">Fresh & Hot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (template === 'modern') {
    return (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={customStyle}>
        {/* Dynamic gradient background */}
        <div className="absolute inset-0">
          {vendor.storefront?.banner ? (
            <>
              <img 
                src={vendor.storefront.banner} 
                alt="Store banner"
                className="w-full h-full object-cover opacity-10"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95"></div>
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
          )}
        </div>

        {/* Floating geometric elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-full blur-3xl animate-pulse opacity-60" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/5 rounded-full blur-2xl animate-pulse opacity-60" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>

        <div className="relative container mx-auto px-6 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Logo section */}
            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl opacity-70"></div>
              <VendorLogo 
                vendor={vendor}
                size="2xl"
                showFallback={true}
                variant="rounded"
                className="relative z-10 mx-auto backdrop-blur-sm bg-card/60 p-8 rounded-3xl border border-muted/20 shadow-2xl"
              />
            </div>

            {/* Hero text */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-[1.1]">
                <span className="block font-extralight text-muted-foreground text-lg mb-4 tracking-widest uppercase">Welcome to</span>
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  {vendor.storefront?.heroText || vendor.storeName}
                </span>
              </h1>
              
              <div className="flex justify-center">
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
                {vendor.storefront?.heroSubtext || vendor.description || 'Where contemporary cuisine meets timeless elegance in every carefully crafted dish.'}
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="group">
                <div className="relative p-6 rounded-2xl bg-card/40 border border-muted/20 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 mx-auto">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Premium Quality</h3>
                    <p className="text-sm text-muted-foreground">Curated ingredients, exceptional taste</p>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="relative p-6 rounded-2xl bg-card/40 border border-muted/20 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center mb-4 mx-auto">
                      <Clock className="h-6 w-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Swift Service</h3>
                    <p className="text-sm text-muted-foreground">Fast, reliable, always on time</p>
                  </div>
                </div>
              </div>

              <div className="group sm:col-span-2 lg:col-span-1">
                <div className="relative p-6 rounded-2xl bg-card/40 border border-muted/20 backdrop-blur-sm hover:bg-card/60 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mb-4 mx-auto">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Made with Care</h3>
                    <p className="text-sm text-muted-foreground">Every dish crafted with passion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-50">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <div className="w-6 h-10 border border-muted rounded-full flex justify-center">
              <div className="w-0.5 h-2 bg-muted-foreground rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-muted-foreground font-light tracking-wide">Scroll</span>
          </div>
        </div>
      </section>
    );
  }

  // Premium template
  return (
    <section className="relative min-h-[70vh] flex items-center" style={customStyle}>
      {vendor.storefront?.banner && (
        <div className="absolute inset-0 opacity-30">
          <img 
            src={vendor.storefront.banner} 
            alt="Store banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background/80"></div>
        </div>
      )}
      
      <div className="relative container mx-auto px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full scale-150 blur-2xl"></div>
            <VendorLogo 
              vendor={vendor}
              size="xl"
              showFallback={true}
              variant="rounded"
              className="mx-auto relative z-10 border-2 border-primary/10 p-2"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-light mb-8 text-foreground tracking-wide leading-tight">
            {vendor.storefront?.heroText || vendor.storeName}
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-12 max-w-2xl mx-auto">
            {vendor.storefront?.heroSubtext || vendor.description || 'Crafted with passion. Served with excellence. An experience beyond ordinary.'}
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-light">Premium Quality</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border border-primary/30 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-light">Timely Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (template === 'classic') {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100" style={customStyle}>
        {/* Vintage paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.15) 1px, transparent 0),
              repeating-linear-gradient(0deg, rgba(210, 180, 140, 0.1), rgba(210, 180, 140, 0.1) 1px, transparent 1px, transparent 20px)
            `,
            backgroundSize: '20px 20px, 100% 20px'
          }}
        />

        {/* Ornamental borders */}
        <div className="absolute inset-4 border-4 border-primary/30 rounded-lg"></div>
        <div className="absolute inset-8 border-2 border-primary/20 rounded-md"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Vintage logo display */}
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-full blur-xl"></div>
                <VendorLogo 
                  vendor={vendor}
                  size="xl"
                  showFallback={true}
                  variant="circle"
                  className="relative w-32 h-32 mx-auto border-4 border-primary/30 shadow-2xl"
                />
              </div>
            </div>

            {/* Classic typography */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-serif font-bold text-primary mb-6 leading-none">
                {vendor.storeName}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-primary via-transparent to-transparent"></div>
              </div>
              <p className="text-xl md:text-2xl text-muted-foreground font-light italic leading-relaxed max-w-2xl mx-auto">
                {vendor.description || "Established traditions meet timeless flavors in every carefully crafted dish"}
              </p>
            </div>

            {/* Vintage badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/60 rounded-full border border-primary/20">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground font-medium">Since 1985</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/60 rounded-full border border-primary/20">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground font-medium">Family Recipe</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/60 rounded-full border border-primary/20">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground font-medium">Local Favorite</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative scrollwork */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 border-2 border-primary/30 rounded-full flex items-center justify-center animate-bounce">
            <div className="w-2 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  if (template === 'minimal') {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-white" style={customStyle}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-16">
            {/* Minimal logo */}
            <div className="flex justify-center">
              <VendorLogo 
                vendor={vendor}
                size="lg"
                showFallback={true}
                variant="square"
                className="w-20 h-20"
              />
            </div>

            {/* Minimal typography */}
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-light tracking-wider text-black leading-tight">
                {vendor.storeName}
              </h1>
              
              <div className="w-16 h-px bg-black mx-auto"></div>
              
              <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-lg mx-auto">
                {vendor.description || "Pure. Simple. Exceptional."}
              </p>
            </div>

            {/* Minimal status indicators */}
            <div className="flex justify-center space-x-12">
              <div className="text-center">
                <div className="w-1 h-1 bg-black rounded-full mx-auto mb-2"></div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Fresh Daily</p>
              </div>
              <div className="text-center">
                <div className="w-1 h-1 bg-black rounded-full mx-auto mb-2"></div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Local Source</p>
              </div>
              <div className="text-center">
                <div className="w-1 h-1 bg-black rounded-full mx-auto mb-2"></div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Craft Made</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (template === 'vibrant') {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden" style={customStyle}>
        {/* Dynamic animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-orange-400/30 via-transparent to-green-400/30 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-blue-400/30 via-transparent to-red-400/30 animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        {/* Floating geometric elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-yellow-300/30 rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute bottom-1/3 left-2/3 w-6 h-6 bg-green-300/40 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Vibrant logo with glow effect */}
            <div className="mb-12">
              <div className="relative inline-block">
                <div className="absolute -inset-12 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }}></div>
                <VendorLogo 
                  vendor={vendor}
                  size="xl"
                  showFallback={true}
                  variant="circle"
                  className="relative w-32 h-32 mx-auto border-4 border-white/30 shadow-2xl backdrop-blur-sm bg-white/10"
                />
              </div>
            </div>

            {/* Bold energetic typography */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none drop-shadow-2xl">
                {vendor.storeName}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="w-8 h-2 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full animate-pulse"></div>
                <div className="w-6 h-6 bg-white rounded-full animate-bounce"></div>
                <div className="w-8 h-2 bg-gradient-to-r from-green-300 to-blue-300 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl md:text-3xl text-white/90 font-bold leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
                {vendor.description || "Explosive flavors, vibrant experiences, unforgettable memories!"}
              </p>
            </div>

            {/* Energetic feature highlights */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Lightning Fast
                </span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Fresh & Bold
                </span>
              </div>
              <div className="px-6 py-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Made with Love
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce backdrop-blur-sm">
            <div className="w-3 h-8 bg-gradient-to-b from-white to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback to future template
};

export default HeroSection;