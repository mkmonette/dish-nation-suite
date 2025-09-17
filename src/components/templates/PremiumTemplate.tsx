import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface PremiumTemplateProps {
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

const PremiumTemplate: React.FC<PremiumTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#1f2937',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d4af37',
    '--accent-color': vendor.storefront?.colors?.accent || '#6b7280',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative"
      style={customStyle}
    >
      {/* Storytelling luxury texture overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-600/5 pointer-events-none" />
      
      {/* Elegant storytelling frame */}
      <div className="fixed inset-6 border border-amber-400/20 rounded-3xl pointer-events-none" />
      <div className="fixed inset-12 border border-amber-400/10 rounded-2xl pointer-events-none" />
      
      {/* Premium storytelling corner accents */}
      <div className="fixed top-12 left-12 w-16 h-16 border-l-2 border-t-2 border-amber-400/30 rounded-tl-2xl pointer-events-none" />
      <div className="fixed top-12 right-12 w-16 h-16 border-r-2 border-t-2 border-amber-400/30 rounded-tr-2xl pointer-events-none" />
      <div className="fixed bottom-12 left-12 w-16 h-16 border-l-2 border-b-2 border-amber-400/30 rounded-bl-2xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-16 h-16 border-r-2 border-b-2 border-amber-400/30 rounded-br-2xl pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 text-amber-400/20 text-4xl pointer-events-none">❦</div>
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-amber-400/20 text-4xl pointer-events-none">❦</div>
      
      <div className="relative z-10">
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
          template="premium"
        />
      </div>
    </div>
  );
};

export default PremiumTemplate;