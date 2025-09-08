import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Vendor } from '@/lib/storage';
import { Clock, Award, Heart, Shield } from 'lucide-react';

interface BusinessInfoSectionProps {
  vendor: Vendor;
  template: 'modern' | 'classic' | 'minimal';
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ vendor, template }) => {
  // Default content when vendor doesn't have custom about us content
  const defaultAboutContent = vendor.storefront?.aboutUs || 
    `Welcome to ${vendor.storeName}! We are passionate about providing exceptional food and service to our community. Our team is dedicated to creating memorable dining experiences with fresh ingredients and authentic flavors.`;

  const features = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery to your doorstep'
    },
    {
      icon: Shield,
      title: 'Quality Assured', 
      description: 'Fresh ingredients and highest food safety standards'
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every dish prepared with care and attention to detail'
    }
  ];

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
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 border-0 bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
          
          {defaultAboutContent && (
            <div className="mt-20 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-foreground">About Us</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{defaultAboutContent}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (template === 'classic') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-primary">
              Our Excellence
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground">Tradition meets innovation</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-8 border border-primary/20 bg-background hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground font-serif">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
          
          {defaultAboutContent && (
            <div className="mt-20 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-6 text-primary font-serif">Our Story</h3>
              <div className="w-16 h-1 bg-primary mx-auto mb-8"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">{defaultAboutContent}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (template === 'minimal') {
    return (
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">
              Our Philosophy
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-8"></div>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-3 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {defaultAboutContent && (
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <h3 className="text-xl font-light mb-6 text-foreground">About</h3>
              <div className="w-12 h-px bg-primary mx-auto mb-8"></div>
              <p className="text-muted-foreground leading-relaxed">{defaultAboutContent}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return null;
};

export default BusinessInfoSection;