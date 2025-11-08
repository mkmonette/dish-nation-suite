import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { CreditCard, Smartphone, Wallet, Banknote } from 'lucide-react';

interface PaymentMethodsSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
  section: SectionConfig;
}

const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({ vendor, template, section }) => {
  const methods = [
    { icon: CreditCard, title: 'Credit/Debit Cards', description: 'All major cards accepted' },
    { icon: Smartphone, title: 'Digital Wallets', description: 'PayPal, Apple Pay, Google Pay' },
    { icon: Wallet, title: 'Online Banking', description: 'Direct bank transfers' },
    { icon: Banknote, title: 'Cash on Delivery', description: 'Pay when you receive' },
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {section.content?.title || 'Payment Methods'}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{section.content?.subtitle || 'Multiple payment options for your convenience'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {methods.map((method, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-center hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full font-medium">
                <Shield className="w-4 h-4" />
                All transactions are secure and encrypted
              </span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return null;
};

function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export default PaymentMethodsSection;
