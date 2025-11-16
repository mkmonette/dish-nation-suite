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
import ServicesSection from './ServicesSection';
import HowItWorksSection from './HowItWorksSection';
import GallerySection from './GallerySection';
import CTASection from './CTASection';
import NewsletterSection from './NewsletterSection';
import FAQSection from './FAQSection';
import TeamSection from './TeamSection';
import ContactSection from './ContactSection';
import StatsSection from './StatsSection';
import OffersSection from './OffersSection';
import DeliverySection from './DeliverySection';
import PaymentMethodsSection from './PaymentMethodsSection';
import PartnersSection from './PartnersSection';

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
  template: 'modern-glass' | 'sleek-minimal';
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
  // Log all sections being processed
  console.log(`[SectionRenderer] Processing ${sections.length} sections for template: ${template}`);
  console.log('[SectionRenderer] All sections:', sections.map(s => `${s.id} (${s.enabled ? 'enabled' : 'disabled'})`).join(', '));
  
  const renderSection = (section: SectionConfig) => {
    console.log('Rendering section:', section.id, 'enabled:', section.enabled);
    
    // Skip disabled sections completely (they won't render at all)
    if (!section.enabled) {
      console.log('Skipping disabled section:', section.id);
      return null;
    }

    switch (section.id) {
      case 'header':
        return <HeaderSection key={section.id} headerComponent={headerComponent} template={template} section={section} />;
      case 'hero':
        return <HeroSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'featured':
        return (
          <FeaturedProductsSection
            key={section.id}
            vendor={vendor}
            menuItems={menuItems.slice(0, 6)}
            onAddToCart={onAddToCart}
            template={template}
            section={section}
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
            section={section}
          />
        );
      case 'promos':
        return <PromoBannersSection key={section.id} vendor={vendor} template={template} section={section} />;
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
            section={section}
          />
        );
      case 'about':
        return <BusinessInfoSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'services':
        return <ServicesSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'howItWorks':
        return <HowItWorksSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'reviews':
        return <ReviewsSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'gallery':
        return <GallerySection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'cta':
        return <CTASection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'newsletter':
        return <NewsletterSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'faq':
        return <FAQSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'team':
        return <TeamSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'contact':
        return <ContactSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'stats':
        return <StatsSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'offers':
        return <OffersSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'delivery':
        return <DeliverySection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'payment':
        return <PaymentMethodsSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'partners':
        return <PartnersSection key={section.id} vendor={vendor} template={template} section={section} />;
      case 'footer':
        return <FooterSection key={section.id} vendor={vendor} cartComponent={cartComponent} template={template} section={section} />;
      default:
        console.warn(`[SectionRenderer] Unknown section ID: ${section.id} - rendering placeholder`);
        return (
          <div key={section.id} className="py-8 px-4 bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg">
            <p className="text-center text-muted-foreground">
              Section "{section.id}" ({section.name}) - Coming Soon
            </p>
          </div>
        );
    }
  };

  const enabledCount = sections.filter(s => s.enabled).length;
  console.log(`[SectionRenderer] Rendering ${enabledCount} enabled sections out of ${sections.length} total`);

  return (
    <>
      {sections.map((section) => renderSection(section))}
    </>
  );
};

export default SectionRenderer;