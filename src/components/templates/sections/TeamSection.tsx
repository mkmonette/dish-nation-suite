import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface TeamSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const TeamSection: React.FC<TeamSectionProps> = ({ vendor, template, section }) => {
  const team = section.content?.items || [
    { name: 'John Doe', role: 'Head Chef', image: getDefaultPlaceholder('profile') },
    { name: 'Jane Smith', role: 'Sous Chef', image: getDefaultPlaceholder('profile') },
    { name: 'Mike Johnson', role: 'Pastry Chef', image: getDefaultPlaceholder('profile') },
    { name: 'Sarah Williams', role: 'Manager', image: getDefaultPlaceholder('profile') },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Meet Our Team'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'The people behind your delicious meals'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member: any, index: number) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-white/20 group-hover:ring-indigo-400 transition-all duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default TeamSection;
