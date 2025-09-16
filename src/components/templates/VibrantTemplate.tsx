import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface VibrantTemplateProps {
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

const VibrantTemplate: React.FC<VibrantTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#FF6B35',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#F7931E',
    '--accent-color': vendor.storefront?.colors?.accent || '#FFD23F',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden"
      style={customStyle}
    >
      {/* Animated colorful background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-70 animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 -right-32 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-500 rounded-full blur-3xl opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-gradient-to-br from-red-400 to-pink-500 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 -right-20 w-56 h-56 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDuration: '6s', animationDelay: '3s' }}></div>
      </div>
      
      {/* Vibrant geometric shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-300 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-green-300 rotate-45 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-blue-300 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>
      
      {/* Content with vibrant glass effect */}
      <div className="relative z-10 backdrop-blur-sm">
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
          template="vibrant"
        />
      </div>
    </div>
  );
};

export default VibrantTemplate;