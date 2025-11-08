import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Search, ShoppingCart, Truck, CheckCircle } from 'lucide-react';

interface HowItWorksSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ vendor, template, section }) => {
  const steps = section.content?.items || [
    { icon: 'search', title: 'Browse Menu', description: 'Explore our wide selection of delicious items' },
    { icon: 'cart', title: 'Add to Cart', description: 'Select your favorite items and customize them' },
    { icon: 'truck', title: 'Fast Delivery', description: 'We prepare and deliver your order quickly' },
    { icon: 'check', title: 'Enjoy', description: 'Savor your meal at your doorstep' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'How It Works'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Simple steps to satisfaction'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((step: any, index: number) => (
              <div key={index} className="relative">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30"></div>
                )}
                
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      {step.icon === 'search' && <Search className="w-10 h-10 text-white" />}
                      {step.icon === 'cart' && <ShoppingCart className="w-10 h-10 text-white" />}
                      {step.icon === 'truck' && <Truck className="w-10 h-10 text-white" />}
                      {step.icon === 'check' && <CheckCircle className="w-10 h-10 text-white" />}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
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

export default HowItWorksSection;
