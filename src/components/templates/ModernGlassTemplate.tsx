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
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden"
      style={customStyle}
    >
      {/* Dynamic background with floating elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10 animate-pulse" style={{animationDuration: '8s'}}></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-3xl animate-bounce" style={{animationDuration: '6s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-br from-purple-500/15 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/3 w-48 h-48 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: '8s', animationDelay: '4s'}}></div>
        
        {/* Geometric decorations */}
        <div className="absolute top-1/6 right-1/4 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/6 w-4 h-4 bg-purple-400/40 rotate-45 animate-bounce" style={{animationDuration: '4s'}}></div>
        <div className="absolute top-1/2 right-1/6 w-2 h-8 bg-gradient-to-b from-cyan-400/30 to-transparent rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Subtle pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main content container */}
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
          template="modern-glass"
        />
      </div>
    </div>
  );
};

export default ModernGlassTemplate;