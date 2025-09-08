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
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background" style={customStyle}>
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
  );
};

export default ModernTemplate;