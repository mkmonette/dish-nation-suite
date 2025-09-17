import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface MinimalTemplateProps {
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

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#000000',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#666666',
    '--accent-color': vendor.storefront?.colors?.accent || '#999999',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-white relative overflow-hidden"
      style={customStyle}
    >
      {/* Ultra-minimal dot pattern */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #000000 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Subtle geometric accent */}
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent pointer-events-none"></div>
      <div className="fixed top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-black/10 to-transparent pointer-events-none"></div>
      
      {/* Floating minimal elements */}
      <div className="fixed top-1/4 right-1/4 w-2 h-2 bg-black/5 rounded-full animate-pulse pointer-events-none" style={{animationDuration: '8s'}}></div>
      <div className="fixed bottom-1/3 left-1/3 w-1 h-1 bg-black/10 rounded-full animate-pulse pointer-events-none" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
      
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
          template="minimal"
        />
      </div>
    </div>
  );
};

export default MinimalTemplate;