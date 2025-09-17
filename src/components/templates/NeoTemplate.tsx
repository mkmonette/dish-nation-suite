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
      className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden"
      style={customStyle}
    >
      {/* Cyberpunk grid */}
      <div 
        className="fixed inset-0 opacity-[0.1] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #ef4444 1px, transparent 1px),
            linear-gradient(180deg, #ef4444 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Neon elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Glowing geometric shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-red-500/50 rotate-45 rounded-lg animate-pulse" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-yellow-500/30 rotate-12 rounded-full blur-sm animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 border-2 border-purple-500/40 rotate-[30deg] rounded-xl animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-red-500/20 rotate-[60deg] rounded-lg animate-pulse" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}></div>
        
        {/* Scanning effects */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500/0 via-red-500/80 to-red-500/0 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500/0 via-yellow-500/80 to-yellow-500/0 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        {/* Circuit-like patterns */}
        <div className="absolute top-1/4 left-1/3 w-16 h-2 bg-purple-500/60 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-16 bg-red-500/60 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-yellow-500/50 rotate-45 animate-spin" style={{animationDuration: '15s'}}></div>
      </div>
      
      {/* Cyberpunk overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-red-500/10 via-transparent to-purple-500/5 pointer-events-none"></div>
      
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
          template="neo"
        />
      </div>
    </div>
  );
};

export default NeoTemplate;