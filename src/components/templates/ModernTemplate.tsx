import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface ModernTemplateProps {
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

const ModernTemplate: React.FC<ModernTemplateProps> = ({
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
    '--secondary-color': vendor.storefront?.colors?.secondary || '#3b82f6',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background/80 relative overflow-x-hidden"
      style={customStyle}
    >
      {/* Subtle geometric background pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 25%, hsl(var(--accent)) 1px, transparent 1px),
            radial-gradient(circle at 25% 75%, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 80px 80px, 120px 120px, 90px 90px',
          backgroundPosition: '0 0, 20px 20px, 40px 5px, 70px 35px'
        }}></div>
      </div>

      {/* Floating accent elements */}
      <div className="fixed top-20 right-20 w-2 h-20 bg-gradient-to-b from-primary/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
      <div className="fixed bottom-32 left-16 w-2 h-16 bg-gradient-to-t from-secondary/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      <div className="fixed top-1/3 left-8 w-1 h-12 bg-gradient-to-b from-accent/30 to-transparent rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>

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
          template="modern"
        />
      </div>
    </div>
  );
};

export default ModernTemplate;