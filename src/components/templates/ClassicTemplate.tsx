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
    '--primary-color': vendor.storefront?.colors?.primary || '#8b5a3c',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#d4af37',
    '--accent-color': vendor.storefront?.colors?.accent || '#c41e3a',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-background" style={customStyle}>
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
  );
};

export default ClassicTemplate;