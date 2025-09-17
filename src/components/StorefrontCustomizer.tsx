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
import { Palette, Save, Eye, FileText, Settings, Check, GripVertical, Settings2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IconName } from '@/icons';
import { iconStorage } from '@/components/IconManager';
import ImageUpload from '@/components/ui/image-upload';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getDefaultPlaceholder } from '@/utils/imageUtils';
import SortableSection from './SortableSection';
import StorefrontSidebar from './StorefrontSidebar';

interface StorefrontCustomizerProps {
  vendor: Vendor;
  onUpdate: (updatedVendor: Vendor) => void;
}

interface TemplateConfig {
  template: 'basic';
  sections: SectionConfig[];
}

const StorefrontCustomizer: React.FC<StorefrontCustomizerProps> = ({ vendor, onUpdate }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('template');
  
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
    template: 'basic' as 'basic',
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
  
  // Initialize template configs properly, avoiding circular references
  const initializeTemplateConfigs = () => {
    const configs: Record<string, SectionConfig[]> = {};
    const templates = ['basic'] as const;
    
    templates.forEach(template => {
      const storedConfig = vendor.storefront?.templateConfigs?.[template];
      // Check if stored config is valid (array) and not a circular reference
      if (Array.isArray(storedConfig) && storedConfig.length > 0) {
        configs[template] = storedConfig;
      } else {
        configs[template] = [...defaultSections]; // Deep copy to avoid reference issues
      }
    });
    
    return configs;
  };
  
  const [templateConfigs, setTemplateConfigs] = useState<Record<string, SectionConfig[]>>(initializeTemplateConfigs());
  
  const [isLoading, setIsLoading] = useState(false);

  const templates = [
    { 
      value: 'basic', 
      label: 'Basic', 
      description: 'Clean and simple design with all essential features',
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
      
      // Notify other windows/tabs that vendor data has changed
      window.dispatchEvent(new CustomEvent('vendorUpdated'));
    }
    
    setIsLoading(false);
  };

  const handleTemplateChange = (template: 'basic') => {
    setSettings(prev => ({ ...prev, template }));
    
    // Auto-save template change
    const newSettings = { ...settings, template };
    vendorStorage.update(vendor.id, { storefront: { ...newSettings, templateConfigs } });
    onUpdate({ ...vendor, storefront: { ...newSettings, templateConfigs } });
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
  };

  const handleApplyTemplate = (template: 'basic') => {
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
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
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
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
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
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
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
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
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
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
  };

  const handleIconChange = (section: string, iconType: string, value: string) => {
    const newSettings = {
      ...settings,
      icons: {
        ...settings.icons,
        [section]: {
          ...settings.icons?.[section],
          [iconType]: value
        }
      }
    };
    setSettings(newSettings);
    
    // Auto-save for instant updates
    vendorStorage.update(vendor.id, { storefront: newSettings });
    onUpdate({ ...vendor, storefront: newSettings });
    
    // Notify other windows/tabs that vendor data has changed
    window.dispatchEvent(new CustomEvent('vendorUpdated'));
  };

  // Get available icons (bundled + uploaded)
  const getAvailableIcons = () => {
    const bundledIcons: string[] = [
      'shopping-cart-outline', 'heart-outline', 'user-outline', 'star-outline', 
      'check-circle', 'x-circle', 'plus', 'minus', 'home', 'search', 'menu', 'bell'
    ];
    
    const uploadedIcons = iconStorage.getAll().map(icon => icon.filename);
    
    return [...bundledIcons, ...uploadedIcons];
  };

  const previewUrl = `/store/${vendor.slug}`;
  
  console.log('Store URL:', window.location.origin + previewUrl);
  console.log('Vendor slug:', vendor.slug);

  const renderContent = () => {
    switch (activeSection) {
      case 'template':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Store Template</CardTitle>
              <CardDescription>Choose and customize your store's template</CardDescription>
            </CardHeader>
            <CardContent>
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
                          onClick={() => handleApplyTemplate(template.value as 'basic')}
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
            </CardContent>
          </Card>
        );

      case 'sections':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Section Configuration</CardTitle>
              <CardDescription>
                Manage sections for {templates.find(t => t.value === settings.template)?.label} template. Toggle sections on/off and drag to reorder them.
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
        );

      case 'assets':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>Upload your logo and banner images</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      case 'colors':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>Changes apply instantly across your storefront</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      case 'icons':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Icon Settings</CardTitle>
              <CardDescription>Choose icons for different sections of your storefront</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features Icons */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Feature Icons</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-icon">Delivery Icon</Label>
                      <Select
                        value={settings.icons?.features?.delivery || 'plus'}
                        onValueChange={(value) => handleIconChange('features', 'delivery', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quality-icon">Quality Icon</Label>
                      <Select
                        value={settings.icons?.features?.quality || 'check-circle'}
                        onValueChange={(value) => handleIconChange('features', 'quality', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service-icon">Service Icon</Label>
                      <Select
                        value={settings.icons?.features?.service || 'heart-outline'}
                        onValueChange={(value) => handleIconChange('features', 'service', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Promotion Icons */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Promotion Icons</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="speed-icon">Speed Icon</Label>
                      <Select
                        value={settings.icons?.promotions?.speed || 'plus'}
                        onValueChange={(value) => handleIconChange('promotions', 'speed', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="offers-icon">Offers Icon</Label>
                      <Select
                        value={settings.icons?.promotions?.offers || 'star-outline'}
                        onValueChange={(value) => handleIconChange('promotions', 'offers', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="availability-icon">Availability Icon</Label>
                      <Select
                        value={settings.icons?.promotions?.availability || 'bell'}
                        onValueChange={(value) => handleIconChange('promotions', 'availability', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableIcons().map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              {icon.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'hero':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Customize your hero banner text</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      case 'about':
        return (
          <Card>
            <CardHeader>
              <CardTitle>About Us</CardTitle>
              <CardDescription>Tell your story and connect with customers</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <StorefrontSidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Storefront Customization</h1>
            <p className="text-muted-foreground">Customize your store's appearance and branding</p>
          </div>
          
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
            <Button 
              variant="hero" 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default StorefrontCustomizer;