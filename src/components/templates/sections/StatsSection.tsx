import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Users, ShoppingBag, Star, Award } from 'lucide-react';

interface StatsSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const StatsSection: React.FC<StatsSectionProps> = ({ vendor, template, section }) => {
  const stats = section.content?.items || [
    { icon: 'users', value: '10,000+', label: 'Happy Customers' },
    { icon: 'orders', value: '50,000+', label: 'Orders Delivered' },
    { icon: 'rating', value: '4.9/5', label: 'Average Rating' },
    { icon: 'awards', value: '15+', label: 'Awards Won' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon === 'users' && <Users className="w-8 h-8 text-white" />}
                  {stat.icon === 'orders' && <ShoppingBag className="w-8 h-8 text-white" />}
                  {stat.icon === 'rating' && <Star className="w-8 h-8 text-white" />}
                  {stat.icon === 'awards' && <Award className="w-8 h-8 text-white" />}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default StatsSection;
