import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vendor } from '@/lib/storage';
import { Percent, Clock, Gift } from 'lucide-react';

interface PromoBannersSectionProps {
  vendor: Vendor;
  template: 'modern' | 'classic' | 'minimal';
}

const PromoBannersSection: React.FC<PromoBannersSectionProps> = ({ vendor, template }) => {
  // Sample promo data - in a real app this would come from props or API
  const promos = [
    {
      id: '1',
      title: '20% Off First Order',
      description: 'New customers save on their first delivery',
      icon: Percent,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '2', 
      title: 'Free Delivery',
      description: 'On orders over $25',
      icon: Clock,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: '3',
      title: 'Weekend Special',
      description: 'Buy 2 get 1 free on selected items',
      icon: Gift,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  if (template === 'modern') {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Special Offers
            </h2>
            <p className="text-lg text-muted-foreground">Don't miss out on these amazing deals</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {promos.map((promo) => {
              const IconComponent = promo.icon;
              return (
                <Card key={promo.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className={`p-6 bg-gradient-to-br ${promo.color} text-white`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Limited Time
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                    <p className="text-white/90">{promo.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (template === 'classic') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">Current Promotions</h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-0.5 bg-primary"></div>
              <div className="w-3 h-3 bg-primary rotate-45"></div>
              <div className="w-12 h-0.5 bg-primary"></div>
            </div>
            <p className="text-xl text-muted-foreground">Exceptional value for discerning palates</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {promos.map((promo) => {
              const IconComponent = promo.icon;
              return (
                <Card key={promo.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3 text-foreground">{promo.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{promo.description}</p>
                    <Badge variant="outline" className="mt-4 border-primary/30 text-primary font-serif">
                      Available Now
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Minimal template
  return (
    <section className="py-20 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-extralight text-primary tracking-wider mb-8">Offers</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          {promos.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <div key={promo.id} className="flex items-center justify-between py-6 border-b border-border/20 hover:border-border/40 transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 border border-primary/20 rounded-full flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-foreground tracking-wide mb-1">{promo.title}</h3>
                    <p className="text-muted-foreground font-light text-sm">{promo.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-primary/30 font-light">
                  Active
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoBannersSection;