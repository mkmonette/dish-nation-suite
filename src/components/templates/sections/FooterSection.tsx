import React from 'react';
import { Vendor } from '@/lib/storage';
import { Star, MapPin, Heart, Award } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';

interface FooterSectionProps {
  vendor: Vendor;
  cartComponent: React.ReactNode;
  template: 'modern' | 'classic' | 'minimal';
}

const FooterSection: React.FC<FooterSectionProps> = ({ vendor, cartComponent, template }) => {
  if (template === 'modern') {
    return (
      <>
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
      </>
    );
  }

  if (template === 'classic') {
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

  // Minimal template
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