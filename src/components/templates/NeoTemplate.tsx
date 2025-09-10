import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface NeoTemplateProps {
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

const NeoTemplate: React.FC<NeoTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#ef4444',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#f59e0b',
    '--accent-color': vendor.storefront?.colors?.accent || '#8b5cf6',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-background relative"
      style={customStyle}
    >
      {/* Neo geometric background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rotate-45 rounded-lg" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary rotate-12 rounded-full" />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-accent rotate-[30deg] rounded-xl" />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-primary rotate-[60deg] rounded-lg" />
      </div>
      
      {/* Bold accent lines */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-primary pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-primary pointer-events-none" />
      
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
          template="neo"
        />
      </div>
    </div>
  );
};

export default NeoTemplate;