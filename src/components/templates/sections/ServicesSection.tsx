import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Truck, Award, Clock } from 'lucide-react';

interface ServicesSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ vendor, template, section }) => {
  const services = section.content?.items || [
    { icon: 'truck', title: 'Fast Delivery', description: 'Get your orders delivered quickly and safely' },
    { icon: 'award', title: 'Quality Products', description: 'Premium quality guaranteed on every item' },
    { icon: 'clock', title: '24/7 Support', description: 'Round the clock customer support' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Our Services'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Why choose us'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service: any, index: number) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  {service.icon === 'truck' && <Truck className="w-8 h-8 text-white" />}
                  {service.icon === 'award' && <Award className="w-8 h-8 text-white" />}
                  {service.icon === 'clock' && <Clock className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default ServicesSection;
