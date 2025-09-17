import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface FutureTemplateProps {
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

const FutureTemplate: React.FC<FutureTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#8b5cf6',
    '--accent-color': vendor.storefront?.colors?.accent || '#06b6d4',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-white relative"
      style={customStyle}
    >
      {/* Minimalist grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000000 1px, transparent 1px),
            linear-gradient(to bottom, #000000 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px'
        }}
      />
      
      {/* Clean content area */}
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
          template="future"
        />
      </div>
    </div>
  );
};

export default FutureTemplate;