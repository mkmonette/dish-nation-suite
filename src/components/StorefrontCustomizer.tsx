import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Vendor, vendorStorage, SectionConfig } from '@/lib/storage';
import { Palette, Save, Eye, FileText, Settings, Check, GripVertical } from 'lucide-react';
import ImageUpload from '@/components/ui/image-upload';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import SortableSection from './SortableSection';

interface StorefrontCustomizerProps {
  vendor: Vendor;
  onUpdate: (updatedVendor: Vendor) => void;
}

interface TemplateConfig {
  template: 'modern' | 'classic' | 'minimal';
  sections: SectionConfig[];
}

const StorefrontCustomizer: React.FC<StorefrontCustomizerProps> = ({ vendor, onUpdate }) => {
  const navigate = useNavigate();
  
  const defaultSections: SectionConfig[] = [
    { id: 'header', name: 'Header', enabled: true, order: 0 },
    { id: 'hero', name: 'Hero Banner', enabled: true, order: 1 },
    { id: 'featured', name: 'Featured Products', enabled: true, order: 2 },
    { id: 'categories', name: 'Categories', enabled: true, order: 3 },
    { id: 'promos', name: 'Promo Banners', enabled: true, order: 4 },
    { id: 'menu', name: 'Full Menu', enabled: true, order: 5 },
    { id: 'reviews', name: 'Customer Reviews', enabled: true, order: 6 },
    { id: 'business', name: 'Business Info', enabled: true, order: 7 },
    { id: 'footer', name: 'Footer', enabled: true, order: 8 },
  ];

  const [settings, setSettings] = useState({
    template: 'modern' as 'modern' | 'classic' | 'minimal',
    colors: {
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
    },
    heroText: '',
    heroSubtext: '',
    logo: '',
    banner: '',
    aboutUs: '',
    ...vendor.storefront,
  });
  
  const [templateConfigs, setTemplateConfigs] = useState<Record<string, SectionConfig[]>>({
    modern: defaultSections,
    classic: defaultSections,
    minimal: defaultSections,
    ...vendor.storefront?.templateConfigs,
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { 
      value: 'modern', 
      label: 'Modern', 
      description: 'Clean and contemporary design with bold elements',
      preview: '/api/placeholder/300/200'
    },
    { 
      value: 'classic', 
      label: 'Classic', 
      description: 'Traditional and elegant layout with timeless appeal',
      preview: '/api/placeholder/300/200'
    },
    { 
      value: 'minimal', 
      label: 'Minimal', 
      description: 'Simple and focused design for modern brands',
      preview: '/api/placeholder/300/200'
    },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    
    const updatedVendor = vendorStorage.update(vendor.id, {
      storefront: { ...settings, templateConfigs }
    });

    if (updatedVendor) {
      onUpdate(updatedVendor);
      toast({ 
        title: 'Storefront Updated!', 
        description: 'Your storefront customization has been saved and is now live.' 
      });
    }
    
    setIsLoading(false);
  };

  const handleTemplateChange = (template: 'modern' | 'classic' | 'minimal') => {
    setSettings(prev => ({ ...prev, template }));
    
    // Auto-save template change
    const newSettings = { ...settings, template };
    vendorStorage.update(vendor.id, { storefront: { ...newSettings, templateConfigs } });
    onUpdate({ ...vendor, storefront: { ...newSettings, templateConfigs } });
  };

  const handleApplyTemplate = (template: 'modern' | 'classic' | 'minimal') => {
    handleTemplateChange(template);
    toast({
      title: 'Template Applied!',
      description: `${templates.find(t => t.value === template)?.label} template is now active.`
    });
  };

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    const currentTemplate = settings.template;
    const updatedSections = templateConfigs[currentTemplate].map(section =>
      section.id === sectionId ? { ...section, enabled } : section
    );
    
    const newTemplateConfigs = {
      ...templateConfigs,
      [currentTemplate]: updatedSections
    };
    
    setTemplateConfigs(newTemplateConfigs);
    
    // Auto-save section changes
    vendorStorage.update(vendor.id, { 
      storefront: { ...settings, templateConfigs: newTemplateConfigs } 
    });
    onUpdate({ 
      ...vendor, 
      storefront: { ...settings, templateConfigs: newTemplateConfigs } 
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const currentTemplate = settings.template;
    const oldIndex = templateConfigs[currentTemplate].findIndex(item => item.id === active.id);
    const newIndex = templateConfigs[currentTemplate].findIndex(item => item.id === over.id);
    
    const reorderedSections = arrayMove(templateConfigs[currentTemplate], oldIndex, newIndex)
      .map((section, index) => ({ ...section, order: index })); // Update order property
    
    const newTemplateConfigs = {
      ...templateConfigs,
      [currentTemplate]: reorderedSections
    };
    
    setTemplateConfigs(newTemplateConfigs);
    
    // Auto-save order changes
    vendorStorage.update(vendor.id, { 
      storefront: { ...settings, templateConfigs: newTemplateConfigs } 
    });
    onUpdate({ 
      ...vendor, 
      storefront: { ...settings, templateConfigs: newTemplateConfigs } 
    });
  };

  const currentSections = templateConfigs[settings.template] || defaultSections;

  const handleColorChange = (colorKey: keyof typeof settings.colors, value: string) => {
    const newSettings = {
      ...settings,
      colors: {
        ...settings.colors,
        [colorKey]: value
      }
    };
    setSettings(newSettings);
    
    // Auto-save for instant updates
    vendorStorage.update(vendor.id, { storefront: newSettings });
    onUpdate({ ...vendor, storefront: newSettings });
  };

  const handleImageChange = (type: 'logo' | 'banner', imageData: string | null) => {
    const newSettings = {
      ...settings,
      [type]: imageData || ''
    };
    setSettings(newSettings);
    
    // Auto-save for instant updates
    vendorStorage.update(vendor.id, { storefront: newSettings });
    onUpdate({ ...vendor, storefront: newSettings });
  };

  const handleTextChange = (field: 'heroText' | 'heroSubtext' | 'aboutUs', value: string) => {
    const newSettings = {
      ...settings,
      [field]: value
    };
    setSettings(newSettings);
    
    // Auto-save for instant updates
    vendorStorage.update(vendor.id, { storefront: newSettings });
    onUpdate({ ...vendor, storefront: newSettings });
  };

  const previewUrl = `/store/${vendor.slug}`;
  
  console.log('Store URL:', window.location.origin + previewUrl);
  console.log('Vendor slug:', vendor.slug);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Storefront Customization
          </CardTitle>
          <CardDescription>
            Customize your store's appearance and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-6">
            <Label className="text-base font-semibold">Store Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.value} 
                  className={`relative transition-all duration-200 hover:shadow-lg ${
                    settings.template === template.value 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:ring-1 hover:ring-muted-foreground/20'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">{template.label}</CardTitle>
                        <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
                      </div>
                      {settings.template === template.value && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-[16/10] rounded-lg border bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-sm text-muted-foreground overflow-hidden">
                      <div className="text-center">
                        <div className="text-xs opacity-75 mb-1">{template.label}</div>
                        <div className="text-lg font-semibold">{template.label} Preview</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/store/${vendor.slug}?preview=${template.value}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant={settings.template === template.value ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleApplyTemplate(template.value as 'modern' | 'classic' | 'minimal')}
                        className="flex-1"
                        disabled={settings.template === template.value}
                      >
                        {settings.template === template.value ? "Active" : "Apply"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Section Configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">Section Configuration</Label>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Manage Sections for {templates.find(t => t.value === settings.template)?.label} Template
                </CardTitle>
                <CardDescription>
                  Toggle sections on/off and drag to reorder them. Changes are saved automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DndContext 
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={currentSections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {currentSections.map((section) => (
                        <SortableSection
                          key={section.id}
                          section={section}
                          onToggle={handleSectionToggle}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </CardContent>
            </Card>
          </div>

          {/* Logo & Banner Upload */}
          <div className="space-y-6">
            <Label className="text-base font-semibold">Brand Assets</Label>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <ImageUpload
                type="logo"
                currentImage={settings.logo || undefined}
                onImageChange={(imageData) => handleImageChange('logo', imageData)}
                maxSizeMB={2}
              />

              {/* Banner Upload */}
              <ImageUpload
                type="banner"
                currentImage={settings.banner || undefined}
                onImageChange={(imageData) => handleImageChange('banner', imageData)}
                maxSizeMB={5}
              />
            </div>
          </div>

          {/* Color Scheme */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Brand Colors</Label>
            <p className="text-sm text-muted-foreground">Changes apply instantly across your storefront</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    value={settings.colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accent-color"
                    type="color"
                    value={settings.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    value={settings.colors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    placeholder="#f59e0b"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Hero Section</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-text">Hero Title</Label>
                <Input
                  id="hero-text"
                  value={settings.heroText || ''}
                  onChange={(e) => handleTextChange('heroText', e.target.value)}
                  placeholder="Welcome to your store"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hero-subtext">Hero Subtitle</Label>
                <Textarea
                  id="hero-subtext"
                  value={settings.heroSubtext || ''}
                  onChange={(e) => handleTextChange('heroSubtext', e.target.value)}
                  placeholder="Delicious food delivered to your door"
                  className="min-h-20"
                />
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <Label className="text-base font-semibold">About Us</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="about-us">Tell your story</Label>
              <Textarea
                id="about-us"
                value={settings.aboutUs || ''}
                onChange={(e) => handleTextChange('aboutUs', e.target.value)}
                placeholder="Share your story, mission, and what makes your food special. This will be displayed on your storefront to help customers connect with your brand."
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground">
                This section will appear on your storefront. Updates are saved automatically.
              </p>
            </div>
          </div>

          {/* Template Preview */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Current Template</Label>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {templates.find(t => t.value === settings.template)?.label} Template
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(previewUrl)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Store
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="hero" 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save All Changes'}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Colors and content update instantly. Click save to ensure all changes are preserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorefrontCustomizer;