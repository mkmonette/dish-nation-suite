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
    '--primary-color': vendor.storefront?.colors?.primary || '#ec4899',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#8b5cf6',
    '--accent-color': vendor.storefront?.colors?.accent || '#06b6d4',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 relative overflow-hidden"
      style={customStyle}
    >
      {/* Dynamic rainbow pattern */}
      <div 
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-opacity='0.2'%3E%3Cpath fill='%23ff0080' d='M25 25h50v50H25z'/%3E%3Cpath fill='%2300ff80' d='M37.5 37.5h25v25h-25z'/%3E%3Cpath fill='%23ff8000' d='M43.75 43.75h12.5v12.5h-12.5z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      
      {/* Explosive background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Rainbow orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-xl animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-400/40 rounded-full blur-lg animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-32 w-48 h-48 bg-orange-400/25 rounded-full blur-2xl animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 right-16 w-36 h-36 bg-red-400/35 rounded-full blur-xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-28 h-28 bg-blue-400/40 rounded-full blur-lg animate-bounce" style={{animationDuration: '4.5s', animationDelay: '2s'}}></div>
        
        {/* Animated shapes */}
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border-4 border-yellow-300/60 rotate-45 animate-spin rounded-lg" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-pink-300/50 rounded-full animate-ping" style={{animationDuration: '2s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 border-2 border-green-300/70 rounded-full animate-pulse" style={{animationDuration: '3s'}}></div>
        
        {/* Floating geometric elements */}
        <div className="absolute top-40 left-1/2 w-6 h-24 bg-gradient-to-b from-purple-400/60 to-transparent rounded-full animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-6 bg-gradient-to-r from-cyan-400/60 to-transparent rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
      </div>
      
      {/* Prismatic overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
      
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
          template="vibrant"
        />
      </div>
    </div>
  );
};

export default VibrantTemplate;