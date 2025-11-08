import React, { useState } from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NewsletterSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ vendor, template, section }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter.',
    });
    setEmail('');
  };

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Stay Updated'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {section.content?.description || 'Subscribe to our newsletter for exclusive deals, new menu items, and special offers!'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-14 px-6 rounded-2xl border-2 border-gray-200 focus:border-indigo-500"
              />
              <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default NewsletterSection;
