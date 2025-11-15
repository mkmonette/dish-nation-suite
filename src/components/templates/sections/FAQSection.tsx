import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section: SectionConfig;
}

const FAQSection: React.FC<FAQSectionProps> = ({ vendor, template, section }) => {
  const faqs = section.content?.items || [
    { question: 'What are your delivery hours?', answer: 'We deliver from 9 AM to 11 PM every day.' },
    { question: 'Do you offer contactless delivery?', answer: 'Yes, contactless delivery is available for all orders.' },
    { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and cash on delivery.' },
    { question: 'How long does delivery take?', answer: 'Typical delivery time is 30-45 minutes depending on your location.' },
    { question: 'Can I customize my order?', answer: 'Absolutely! You can customize items with our variation and add-on options.' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Frequently Asked Questions'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Got questions? We have answers'}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq: any, index: number) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default FAQSection;
