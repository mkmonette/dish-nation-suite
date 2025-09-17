import React from 'react';
import { Vendor, MenuItem, MenuCategory, SectionConfig } from '@/lib/storage';
import HeaderSection from './HeaderSection';
import HeroSection from './HeroSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import CategoriesSection from './CategoriesSection';
import PromoBannersSection from './PromoBannersSection';
import MenuSection from './MenuSection';
import ReviewsSection from './ReviewsSection';
import BusinessInfoSection from './BusinessInfoSection';
import FooterSection from './FooterSection';

interface SectionRendererProps {
  sections: SectionConfig[];
  vendor: Vendor;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (item: MenuItem, quantity?: number, selectedVariation?: any, selectedAddOns?: any[]) => void;
  cartItemCount: number;
  cartComponent: React.ReactNode;
  headerComponent: React.ReactNode;
  template: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const SectionRenderer: React.FC<SectionRendererProps> = ({
  sections,
  vendor,
  menuItems,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  cartComponent,
  headerComponent,
  template,
}) => {
  const renderSection = (section: SectionConfig) => {
    if (!section.enabled) return null;

    switch (section.id) {
      case 'header':
        return <HeaderSection key={section.id} headerComponent={headerComponent} template={template} />;
      case 'hero':
        return <HeroSection key={section.id} vendor={vendor} template={template} />;
      case 'featured':
        return (
          <FeaturedProductsSection
            key={section.id}
            vendor={vendor}
            menuItems={menuItems.slice(0, 6)} // Show first 6 items as featured
            onAddToCart={onAddToCart}
            template={template}
          />
        );
      case 'categories':
        return (
          <CategoriesSection
            key={section.id}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            template={template}
          />
        );
      case 'promos':
        return <PromoBannersSection key={section.id} vendor={vendor} template={template} />;
      case 'menu':
        return (
          <MenuSection
            key={section.id}
            vendor={vendor}
            menuItems={menuItems}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            onAddToCart={onAddToCart}
            template={template}
          />
        );
      case 'reviews':
        return <ReviewsSection key={section.id} vendor={vendor} template={template} />;
      case 'business':
        return <BusinessInfoSection key={section.id} vendor={vendor} template={template} />;
      case 'footer':
        return <FooterSection key={section.id} vendor={vendor} cartComponent={cartComponent} template={template} />;
      default:
        return null;
    }
  };

  return (
    <>
      {sections.map((section) => renderSection(section))}
    </>
  );
};

export default SectionRenderer;