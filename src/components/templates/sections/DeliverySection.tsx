import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Truck, Clock, MapPin, Shield } from 'lucide-react';

interface DeliverySectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const DeliverySection: React.FC<DeliverySectionProps> = ({ vendor, template, section }) => {
  const features = [
    { icon: Truck, title: 'Fast Delivery', description: 'Your order delivered in 30-45 minutes' },
    { icon: Clock, title: 'Order Tracking', description: 'Track your order in real-time' },
    { icon: MapPin, title: 'Wide Coverage', description: 'We deliver to all areas in the city' },
    { icon: Shield, title: 'Safe & Secure', description: 'Contactless delivery available' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Delivery Information'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Fast, reliable, and safe delivery'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Delivery Fee: {section.content?.deliveryFee || '$3.99'}</h3>
            <p className="text-white/90">Free delivery on orders over {section.content?.freeDeliveryThreshold || '$50'}</p>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default DeliverySection;
