import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Vendor } from '@/lib/storage';
import HugeIcon from '@/components/ui/huge-icon';

interface PromoBannersSectionProps {
  vendor: Vendor;
  template: 'basic' | 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const PromoBannersSection: React.FC<PromoBannersSectionProps> = ({ vendor, template }) => {
  // Sample promotions - in a real app this would come from vendor data
  const promotions = [
    {
      id: '1',
      icon: vendor.storefront?.icons?.promotions?.speed || 'plus',
      title: 'Lightning Fast Delivery',
      description: 'Get your order in 30 minutes or less'
    },
    {
      id: '2',
      icon: vendor.storefront?.icons?.promotions?.offers || 'star-outline',
      title: 'Special Offers',
      description: 'Exclusive deals for our valued customers'
    },
    {
      id: '3',
      icon: vendor.storefront?.icons?.promotions?.availability || 'bell',
      title: '24/7 Service',
      description: 'Order anytime, we\'re always here for you'
    }
  ];

  if (template === 'future') {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        {/* Floating elements */}
        <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <div className="w-16 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground">Experience the future of food delivery</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {promotions.map((promo) => (
              <Card key={promo.id} className="group p-8 text-center backdrop-blur-sm bg-card/60 border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 shadow-glow">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow group-hover:shadow-glow transition-all duration-500">
                    <HugeIcon name={promo.icon} size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {promo.description}
                  </p>
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
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">WHY CHOOSE US</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-primary"></div>
            </div>
            <p className="text-lg text-muted-foreground mt-4 font-bold uppercase tracking-wider">BOLD. FAST. RELIABLE.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {promotions.map((promo) => (
              <Card key={promo.id} className="group p-8 text-center border-2 border-primary/30 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/25 bg-background">
                <CardContent className="p-0">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HugeIcon name={promo.icon} size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-foreground group-hover:text-primary transition-colors uppercase tracking-wider">
                    {promo.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    {promo.description}
                  </p>
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
    <section className="py-24 bg-muted/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Our Promise</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground font-light max-w-md mx-auto">Excellence delivered with every order</p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {promotions.map((promo) => (
            <div key={promo.id} className="group text-center">
              <div className="w-12 h-12 mx-auto mb-6 border border-primary/20 rounded-full flex items-center justify-center group-hover:border-primary/40 transition-colors duration-700">
                <HugeIcon name={promo.icon} size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-light mb-4 text-foreground group-hover:text-primary transition-colors tracking-wide">
                {promo.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed font-light">
                {promo.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBannersSection;