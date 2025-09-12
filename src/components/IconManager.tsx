import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import HugeIcon from '@/components/ui/huge-icon';
import { Badge } from '@/components/ui/badge';

interface UploadedIcon {
  id: string;
  name: string;
  filename: string;
  svgContent: string;
  createdAt: string;
}

const UPLOADED_ICONS_KEY = 'foodapp_uploaded_icons';

const iconStorage = {
  getAll(): UploadedIcon[] {
    const icons = localStorage.getItem(UPLOADED_ICONS_KEY);
    return icons ? JSON.parse(icons) : [];
  },

  create(icon: Omit<UploadedIcon, 'id' | 'createdAt'>): UploadedIcon {
    const icons = this.getAll();
    const newIcon: UploadedIcon = {
      ...icon,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    icons.push(newIcon);
    localStorage.setItem(UPLOADED_ICONS_KEY, JSON.stringify(icons));
    
    // Simulate saving SVG to /uploads/icons/ by storing it in a separate key
    localStorage.setItem(`uploads_icons_${icon.filename}`, icon.svgContent);
    
    return newIcon;
  },

  delete(id: string): boolean {
    const icons = this.getAll();
    const iconToDelete = icons.find(icon => icon.id === id);
    if (!iconToDelete) return false;

    const updatedIcons = icons.filter(icon => icon.id !== id);
    localStorage.setItem(UPLOADED_ICONS_KEY, JSON.stringify(updatedIcons));
    
    // Remove the SVG file simulation
    localStorage.removeItem(`uploads_icons_${iconToDelete.filename}`);
    
    return true;
  }
};

const IconManager: React.FC = () => {
  const [uploadedIcons, setUploadedIcons] = useState<UploadedIcon[]>(iconStorage.getAll());
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/svg+xml') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an SVG file.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 500000) { // 500KB limit
      toast({
        title: 'File too large',
        description: 'SVG files must be smaller than 500KB.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const svgContent = await file.text();
      const filename = file.name.replace('.svg', '');
      
      // Check if filename already exists
      const existing = uploadedIcons.find(icon => icon.filename === filename);
      if (existing) {
        toast({
          title: 'Icon already exists',
          description: 'An icon with this filename already exists.',
          variant: 'destructive'
        });
        setIsUploading(false);
        return;
      }

      const newIcon = iconStorage.create({
        name: filename,
        filename,
        svgContent
      });

      setUploadedIcons(iconStorage.getAll());

      toast({
        title: 'Icon uploaded successfully',
        description: `Icon "${filename}" is now available for use.`
      });

    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to process the SVG file.',
        variant: 'destructive'
      });
    }

    setIsUploading(false);
    event.target.value = ''; // Reset input
  };

  const handleDeleteIcon = (iconId: string) => {
    const success = iconStorage.delete(iconId);
    if (success) {
      setUploadedIcons(iconStorage.getAll());
      toast({
        title: 'Icon deleted',
        description: 'The icon has been removed from your library.'
      });
    }
  };

  const bundledIcons = [
    'shopping-cart-outline', 'heart-outline', 'user-outline', 'star-outline',
    'check-circle', 'x-circle', 'plus', 'minus', 'home', 'search', 'menu', 'bell'
  ];

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload New Icon
          </CardTitle>
          <CardDescription>
            Upload SVG icons to use in your storefronts. Icons must be SVG format and under 500KB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="icon-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {isUploading ? 'Uploading...' : 'Click to upload SVG icon'}
                    </p>
                  </div>
                </div>
                <Input
                  id="icon-upload"
                  type="file"
                  accept=".svg"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Icons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Uploaded Icons ({uploadedIcons.length})
          </CardTitle>
          <CardDescription>
            Manage your custom uploaded icons. These can be used in storefront templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedIcons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No custom icons uploaded yet</p>
              <p className="text-sm">Upload SVG files to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedIcons.map((icon) => (
                <div key={icon.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="aspect-square flex items-center justify-center mb-3 bg-muted/30 rounded-lg">
                    <div 
                      className="w-8 h-8"
                      dangerouslySetInnerHTML={{ __html: icon.svgContent }}
                    />
                  </div>
                  <p className="text-sm font-medium text-center mb-2 truncate" title={icon.name}>
                    {icon.name}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteIcon(icon.id)}
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bundled Icons Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">Built-in</Badge>
            Bundled Icons ({bundledIcons.length})
          </CardTitle>
          <CardDescription>
            These icons are included with the system and available for all storefronts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bundledIcons.map((iconName) => (
              <div key={iconName} className="p-4 border rounded-lg bg-muted/20">
                <div className="aspect-square flex items-center justify-center mb-3">
                  <HugeIcon name={iconName} size={32} />
                </div>
                <p className="text-sm font-medium text-center truncate" title={iconName}>
                  {iconName}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconManager;
export { iconStorage, type UploadedIcon };