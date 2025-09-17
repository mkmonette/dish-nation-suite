import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface ModernTemplateProps {
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  cartItemCount: number;
  cartComponent: React.ReactNode;
  headerComponent: React.ReactNode;
  sections: SectionConfig[];
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  cartItemCount,
  cartComponent,
  headerComponent,
  sections,
}) => {
  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#10b981',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#06b6d4',
    '--accent-color': vendor.storefront?.colors?.accent || '#8b5cf6',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden"
      style={customStyle}
    >
      {/* Modern grid pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #000 1px, transparent 1px),
            linear-gradient(180deg, #000 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Dynamic gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 via-teal-200/20 to-blue-200/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/30 via-indigo-200/20 to-cyan-200/30 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-2xl animate-pulse" style={{animationDuration: '6s', animationDelay: '4s'}}></div>
      </div>
      
      {/* Modern floating UI elements */}
      <div className="fixed top-20 left-20 w-8 h-8 border-2 border-emerald-400/30 rounded-lg rotate-45 animate-spin pointer-events-none" style={{animationDuration: '20s'}}></div>
      <div className="fixed bottom-20 right-20 w-6 h-6 bg-teal-400/20 rounded-full animate-bounce pointer-events-none" style={{animationDuration: '3s'}}></div>
      <div className="fixed top-1/3 right-1/4 w-4 h-16 bg-gradient-to-b from-blue-400/20 to-transparent rounded-full animate-pulse pointer-events-none" style={{animationDuration: '4s'}}></div>
      
      <div className="relative z-10 min-h-screen">
        <SectionRenderer
          sections={sections}
          vendor={vendor}
          menuItems={menuItems}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onAddToCart={onAddToCart}
          cartItemCount={cartItemCount}
          cartComponent={cartComponent}
          headerComponent={headerComponent}
          template="modern"
        />
      </div>
    </div>
  );
};

export default ModernTemplate;