import React from 'react';
import { MenuItem, Vendor, MenuCategory, SectionConfig } from '@/lib/storage';
import SectionRenderer from './sections/SectionRenderer';

interface MinimalTemplateProps {
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

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
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
    '--primary-color': vendor.storefront?.colors?.primary || '#000000',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#6b7280',
    '--accent-color': vendor.storefront?.colors?.accent || '#f3f4f6',
  } as React.CSSProperties;

  return (
    <div className="min-h-screen bg-white" style={customStyle}>
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
        template="minimal"
      />
    </div>
  );
};

export default MinimalTemplate;