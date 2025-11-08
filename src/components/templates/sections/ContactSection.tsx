import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const ContactSection: React.FC<ContactSectionProps> = ({ vendor, template, section }) => {
  const contactInfo = [
    { icon: MapPin, label: 'Address', value: section.content?.address || '123 Main Street, City, State 12345' },
    { icon: Phone, label: 'Phone', value: section.content?.phone || '+1 (555) 123-4567' },
    { icon: Mail, label: 'Email', value: section.content?.email || vendor.email },
    { icon: Clock, label: 'Hours', value: section.content?.hours || 'Mon-Sun: 9:00 AM - 11:00 PM' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Get In Touch'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'We\'d love to hear from you'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{info.label}</h3>
                <p className="text-gray-900 font-medium">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default ContactSection;
