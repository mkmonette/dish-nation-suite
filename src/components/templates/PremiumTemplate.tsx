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
      className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background relative"
      style={customStyle}
    >
      {/* Luxury texture overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-muted/5 to-transparent pointer-events-none" />
      
      {/* Elegant border frame */}
      <div className="fixed inset-4 border border-muted/20 rounded-2xl pointer-events-none" />
      <div className="fixed inset-8 border border-muted/10 rounded-xl pointer-events-none" />
      
      {/* Premium corner accents */}
      <div className="fixed top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-primary/30 rounded-tl-lg pointer-events-none" />
      <div className="fixed top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-primary/30 rounded-tr-lg pointer-events-none" />
      <div className="fixed bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-primary/30 rounded-bl-lg pointer-events-none" />
      <div className="fixed bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-primary/30 rounded-br-lg pointer-events-none" />
      
      <div className="relative z-10 p-6">
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