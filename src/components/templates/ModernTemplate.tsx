import React from 'react';
import { MenuItem, Vendor, MenuCategory } from '@/lib/storage';
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
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  cartComponent,
  headerComponent,
}) => {
  const customStyle = {
    '--primary-color': vendor.storefront?.colors?.primary || '#3b82f6',
    '--secondary-color': vendor.storefront?.colors?.secondary || '#10b981',
    '--accent-color': vendor.storefront?.colors?.accent || '#f59e0b',
  } as React.CSSProperties;

  const sections = vendor.storefront?.templateConfigs?.modern || [
    { id: 'header', name: 'Header', enabled: true },
    { id: 'hero', name: 'Hero Banner', enabled: true },
    { id: 'featured', name: 'Featured Products', enabled: true },
    { id: 'categories', name: 'Categories', enabled: true },
    { id: 'promos', name: 'Promo Banners', enabled: false },
    { id: 'menu', name: 'Full Menu', enabled: true },
    { id: 'reviews', name: 'Customer Reviews', enabled: false },
    { id: 'business', name: 'Business Info', enabled: true },
    { id: 'footer', name: 'Footer', enabled: true },
  ];

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
        cartItemCount={0}
        cartComponent={cartComponent}
        headerComponent={headerComponent}
        template="modern"
      />
    </div>
  );
};

export default ModernTemplate;