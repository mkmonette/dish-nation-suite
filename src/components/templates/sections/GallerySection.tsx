import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface GallerySectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const GallerySection: React.FC<GallerySectionProps> = ({ vendor, template, section }) => {
  const images = section.content?.images || [
    getDefaultPlaceholder('food'),
    getDefaultPlaceholder('food'),
    getDefaultPlaceholder('food'),
    getDefaultPlaceholder('food'),
    getDefaultPlaceholder('food'),
    getDefaultPlaceholder('food'),
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Gallery'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Feast your eyes'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image: string, index: number) => (
              <div
                key={index}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 hover:scale-105 transition-all duration-300"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default GallerySection;
