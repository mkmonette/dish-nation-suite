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
    '--primary-color': vendor.storefront?.colors?.primary || '#8b4513',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d2691e',
    '--accent-color': vendor.storefront?.colors?.accent || '#cd853f',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-x-hidden"
      style={customStyle}
    >
      {/* Vintage paper texture */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.03'%3E%3Cpolygon fill='%23000' points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Decorative border frame */}
      <div className="fixed inset-4 border-2 border-amber-700/20 rounded-lg pointer-events-none z-0">
        {/* Corner ornaments */}
        <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-700/30 rotate-45 rounded-sm"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-700/30 rotate-45 rounded-sm"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-amber-700/30 rotate-45 rounded-sm"></div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-700/30 rotate-45 rounded-sm"></div>
      </div>
      
      {/* Classic floating elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl animate-pulse pointer-events-none" style={{animationDuration: '4s'}}></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-orange-200/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
      
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
          template="classic"
        />
      </div>
    </div>
  );
};

export default ClassicTemplate;