import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface PartnersSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const PartnersSection: React.FC<PartnersSectionProps> = ({ vendor, template, section }) => {
  const partners = section.content?.items || [
    { name: 'Partner 1', logo: getDefaultPlaceholder('logo') },
    { name: 'Partner 2', logo: getDefaultPlaceholder('logo') },
    { name: 'Partner 3', logo: getDefaultPlaceholder('logo') },
    { name: 'Partner 4', logo: getDefaultPlaceholder('logo') },
    { name: 'Partner 5', logo: getDefaultPlaceholder('logo') },
    { name: 'Partner 6', logo: getDefaultPlaceholder('logo') },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Our Partners'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Trusted by leading brands'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {partners.map((partner: any, index: number) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 flex items-center justify-center hover:scale-105 transition-all duration-300 grayscale hover:grayscale-0"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-16 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default PartnersSection;
