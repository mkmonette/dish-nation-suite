import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Button } from '@/components/ui/enhanced-button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const CTASection: React.FC<CTASectionProps> = ({ vendor, template, section }) => {
  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-12 md:p-16 relative overflow-hidden">
            {/* Floating decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {section.content?.title || 'Ready to Order?'}
              </h2>
              <p className="text-xl text-white/90 mb-8">
                {section.content?.description || 'Experience the best food delivery service in town. Order now and get your meal delivered hot and fresh!'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90 text-lg px-8 py-6 rounded-2xl shadow-xl">
                  Order Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-2xl">
                  View Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default CTASection;
