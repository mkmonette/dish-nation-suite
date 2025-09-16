import React from 'react';
import { Vendor } from '@/lib/storage';
import { Star, MapPin, Heart, Award, Clock, Zap, Sparkles, Cpu, ShoppingCart } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';
import { Button } from '@/components/ui/enhanced-button';

interface FooterSectionProps {
  vendor: Vendor;
  cartComponent: React.ReactNode;
  template: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const FooterSection: React.FC<FooterSectionProps> = ({ vendor, cartComponent, template }) => {
  if (template === 'future') {
    return (
      <footer className="relative overflow-hidden">
        {/* Holographic background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-primary/5 to-transparent"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(139, 92, 246, 0.1) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(6, 182, 212, 0.1) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(59, 130, 246, 0.1) 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}></div>

        <div className="relative py-20">
          <div className="container mx-auto px-4">
            {/* Main footer content in floating panels */}
            <div className="grid lg:grid-cols-3 gap-12 mb-16">
              
              {/* Brand showcase panel */}
              <div className="lg:col-span-2">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000"></div>
                  <div className="relative backdrop-blur-lg bg-card/40 rounded-3xl border border-primary/30 p-8">
                    
                    {/* Logo and brand section */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-50"></div>
                        <VendorLogo 
                          vendor={vendor}
                          size="lg"
                          showFallback={true}
                          variant="rounded"
                          className="relative w-16 h-16 backdrop-blur-sm bg-card/50 p-2 rounded-2xl border border-primary/30"
                        />
                      </div>
                      <div>
                        <h3 className="font-black text-2xl mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {vendor.storeName}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed max-w-md">
                          {vendor.description || "Transcending culinary boundaries through quantum gastronomy and interdimensional flavor experiences."}
                        </p>
                      </div>
                    </div>

                    {/* Service info in holographic cards */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur"></div>
                        <div className="relative backdrop-blur-sm bg-card/30 rounded-2xl border border-primary/20 p-6">
                          <h4 className="font-bold mb-3 text-primary flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Quantum Hours
                          </h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Mon - Fri</span>
                              <span className="text-foreground font-medium">9AM - 9PM</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Sat - Sun</span>
                              <span className="text-foreground font-medium">10AM - 8PM</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl blur"></div>
                        <div className="relative backdrop-blur-sm bg-card/30 rounded-2xl border border-secondary/20 p-6">
                          <h4 className="font-bold mb-3 text-secondary flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Quick Links
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <a href="#menu" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                              Menu
                            </a>
                            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                              About
                            </a>
                            <a href="#reviews" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                              Reviews
                            </a>
                            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                              Contact
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social connections */}
                    <div className="mt-8 pt-6 border-t border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Connect to our quantum network:</p>
                          <div className="flex space-x-3">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary transition-all duration-300 rounded-full border border-primary/20">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-secondary/20 hover:text-secondary transition-all duration-300 rounded-full border border-secondary/20">
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-accent/20 hover:text-accent transition-all duration-300 rounded-full border border-accent/20">
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Animated status indicator */}
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-muted-foreground">Quantum System Online</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cart component in floating panel */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 via-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-60"></div>
                <div className="relative backdrop-blur-lg bg-card/40 rounded-3xl border border-accent/30 p-6 h-full">
                  <div className="mb-4">
                    <h4 className="font-bold text-accent flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4" />
                      Quantum Cart
                    </h4>
                    <div className="w-full h-0.5 bg-gradient-to-r from-accent via-primary to-secondary rounded-full"></div>
                  </div>
                  {cartComponent}
                </div>
              </div>
            </div>
            
            {/* Bottom bar with holographic effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl blur"></div>
              <div className="relative backdrop-blur-sm bg-card/20 rounded-2xl border border-primary/20 py-6 px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-muted-foreground text-sm">
                    © 2024 <span className="text-primary font-semibold">{vendor.storeName}</span>
                    <span className="mx-2">•</span>
                    <span className="text-xs">Powered by Quantum Gastronomy™</span>
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                      <span>Real-time sync</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <span>Secure ordering</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      <span>AI enhanced</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (template === 'neo') {
    return (
      <>
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
      </>
    );
  }

  // Premium template
  return (
    <>
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
    </>
  );
};

export default FooterSection;