import React from 'react';
import { Palette, Settings, FileText, Package, Layout, Image, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface StorefrontSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const StorefrontSidebar: React.FC<StorefrontSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const menuItems = [
    {
      group: 'Templates & Layout',
      items: [
        { id: 'template', label: 'Store Template', icon: Layout },
        { id: 'sections', label: 'Section Configuration', icon: Package },
      ]
    },
    {
      group: 'Branding',
      items: [
        { id: 'assets', label: 'Brand Assets', icon: Image },
        { id: 'colors', label: 'Brand Colors', icon: Palette },
        { id: 'icons', label: 'Icon Settings', icon: Zap },
      ]
    },
    {
      group: 'Content',
      items: [
        { id: 'hero', label: 'Hero Section', icon: FileText },
        { id: 'about', label: 'About Us', icon: Settings },
      ]
    }
  ];

  const getMenuItemClass = (itemId: string) => {
    return cn(
      'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
      activeSection === itemId 
        ? 'bg-primary text-primary-foreground font-medium' 
        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
    );
  };

  return (
    <div className="w-64 border-r bg-background p-4 space-y-6">
      {menuItems.map((group, index) => (
        <div key={group.group}>
          {index > 0 && <Separator className="my-4" />}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={getMenuItemClass(item.id)}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StorefrontSidebar;