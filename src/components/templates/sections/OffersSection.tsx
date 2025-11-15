import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tag, Percent, Gift } from 'lucide-react';

interface OffersSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const OffersSection: React.FC<OffersSectionProps> = ({ vendor, template, section }) => {
  const offers = section.content?.items || [
    { icon: 'tag', title: 'First Order Discount', description: 'Get 20% off on your first order', code: 'WELCOME20' },
    { icon: 'percent', title: 'Student Discount', description: '15% off for all students', code: 'STUDENT15' },
    { icon: 'gift', title: 'Free Delivery', description: 'On orders above $50', code: 'FREEDEL' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Special Offers'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Save more on every order'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer: any, index: number) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    {offer.icon === 'tag' && <Tag className="w-8 h-8 text-white" />}
                    {offer.icon === 'percent' && <Percent className="w-8 h-8 text-white" />}
                    {offer.icon === 'gift' && <Gift className="w-8 h-8 text-white" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{offer.title}</h3>
                  <p className="text-gray-600 mb-4">{offer.description}</p>
                  <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
                    Code: {offer.code}
                  </Badge>
                  <Button className="w-full rounded-2xl" variant="outline">
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default OffersSection;
