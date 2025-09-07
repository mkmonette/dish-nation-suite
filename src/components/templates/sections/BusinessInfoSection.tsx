import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/lib/storage';
import { MapPin, Clock, Phone, Mail, Award, Heart, Utensils } from 'lucide-react';

interface BusinessInfoSectionProps {
  vendor: Vendor;
  template: 'modern' | 'classic' | 'minimal';
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ vendor, template }) => {
  if (template === 'modern') {
    return (
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
                <Award className="h-8 w-8 text-white fill-current" />
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

          {/* About Us */}
          {vendor.storefront?.aboutUs && (
            <div className="mt-20">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  About Us
                </h3>
                <div className="prose prose-lg mx-auto text-muted-foreground">
                  <p className="whitespace-pre-wrap">{vendor.storefront.aboutUs}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (template === 'classic') {
    return (
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

          {/* About Us */}
          {vendor.storefront?.aboutUs && (
            <div className="mt-20">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">
                  Our Story
                </h3>
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
          )}
        </div>
      </section>
    );
  }

  // Minimal template
  return (
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

        {/* About Us */}
        {vendor.storefront?.aboutUs && (
          <div className="mt-20">
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h3 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
                About
              </h3>
              <div className="prose prose-lg mx-auto">
                <p className="text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                  {vendor.storefront.aboutUs}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessInfoSection;