import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface PremiumTemplateProps {
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

const PremiumTemplate: React.FC<PremiumTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#1f2937',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d4af37',
    '--accent-color': vendor.storefront?.colors?.accent || '#6b7280',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      style={customStyle}
    >
      {/* Luxury marble texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Cpath fill='%23d4af37' fill-opacity='0.1' d='M0 0h200v200H0z'/%3E%3Cpath fill='%23d4af37' fill-opacity='0.05' d='M0 0l200 200H0z'/%3E%3Cpath fill='%23d4af37' fill-opacity='0.05' d='M200 0L0 200V0z'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Premium geometric elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Elegant floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 border border-amber-400/20 rotate-45 rounded-lg animate-pulse" style={{animationDuration: '6s'}}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-amber-400/10 rounded-full blur-sm animate-pulse" style={{animationDuration: '8s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 border-2 border-amber-400/15 rotate-12 rounded-xl animate-pulse" style={{animationDuration: '10s', animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-amber-400/10 to-transparent rounded-lg animate-pulse" style={{animationDuration: '7s', animationDelay: '1s'}}></div>
      </div>
      
      {/* Elegant frame */}
      <div className="fixed inset-8 border border-amber-400/20 rounded-2xl pointer-events-none z-0">
        {/* Corner decorations */}
        <div className="absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-amber-400/40 rounded-tl-lg"></div>
        <div className="absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-amber-400/40 rounded-tr-lg"></div>
        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-amber-400/40 rounded-bl-lg"></div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-amber-400/40 rounded-br-lg"></div>
      </div>
      
      {/* Luxury accents */}
      <div className="fixed top-16 left-1/2 transform -translate-x-1/2 text-amber-400/30 text-2xl pointer-events-none">◆</div>
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 text-amber-400/30 text-2xl pointer-events-none">◆</div>
      
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
          template="premium"
        />
      </div>
    </div>
  );
};

export default PremiumTemplate;