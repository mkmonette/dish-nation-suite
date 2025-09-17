import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface ModernGlassTemplateProps {
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

const ModernGlassTemplate: React.FC<ModernGlassTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#6366f1',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#8b5cf6',
    '--accent-color': vendor.storefront?.colors?.accent || '#06b6d4',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden"
      style={customStyle}
    >
      {/* Modern floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 via-purple-400/5 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/10 via-blue-400/5 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-2xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-indigo-400/20 rounded-full animate-bounce" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 border border-purple-400/30 rounded-lg rotate-45 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-12 bg-gradient-to-b from-cyan-400/20 to-transparent rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '3s'}}></div>
      </div>

      {/* Glassmorphism overlay grid */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(180deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Main content with backdrop blur effect */}
      <div className="relative z-10 min-h-screen backdrop-blur-[0.5px]">
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
          template="modern-glass"
        />
      </div>
    </div>
  );
};

export default ModernGlassTemplate;