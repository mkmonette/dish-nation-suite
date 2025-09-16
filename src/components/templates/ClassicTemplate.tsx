import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface ClassicTemplateProps {
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

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#8B4513',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#D2B48C',
    '--accent-color': vendor.storefront?.colors?.accent || '#CD853F',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-50 relative"
      style={customStyle}
    >
      {/* Classic paper texture overlay */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(139, 69, 19, 0.15) 1px, transparent 0),
            linear-gradient(45deg, rgba(210, 180, 140, 0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(205, 133, 63, 0.1) 25%, transparent 25%)
          `,
          backgroundSize: '20px 20px, 40px 40px, 40px 40px'
        }}
      />
      
      {/* Vintage ornamental corners */}
      <div className="fixed top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-primary/20 pointer-events-none">
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/30"></div>
      </div>
      <div className="fixed top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-primary/20 pointer-events-none">
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/30"></div>
      </div>
      <div className="fixed bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-primary/20 pointer-events-none">
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/30"></div>
      </div>
      <div className="fixed bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-primary/20 pointer-events-none">
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/30"></div>
      </div>
      
      {/* Content with vintage book feel */}
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
          template="classic"
        />
      </div>
    </div>
  );
};

export default ClassicTemplate;