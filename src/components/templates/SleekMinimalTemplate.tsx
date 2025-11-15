import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface SleekMinimalTemplateProps {
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

const SleekMinimalTemplate: React.FC<SleekMinimalTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#0f172a',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#475569',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={customStyle}
    >
      {/* Sleek background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle diagonal lines */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 60px,
              currentColor 60px,
              currentColor 61px
            )`,
            color: 'var(--primary-color)',
          }}
        />
        
        {/* Modern gradient accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-slate-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        
        {/* Floating dots */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent/20 rounded-full animate-pulse" style={{animationDuration: '3s'}} />
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-accent/20 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}} />
        <div className="absolute bottom-1/4 left-2/3 w-2 h-2 bg-accent/20 rounded-full animate-pulse" style={{animationDuration: '5s', animationDelay: '2s'}} />
      </div>

      {/* Card-style content container */}
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
          template="sleek-minimal"
        />
      </div>
    </div>
  );
};

export default SleekMinimalTemplate;
