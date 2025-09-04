import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/enhanced-button';

interface CustomerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  vendorSlug: string;
}

const CustomerSidebar: React.FC<CustomerSidebarProps> = ({ 
  activeSection, 
  onSectionChange,
  vendorSlug
}) => {
  const { state } = useSidebar();

  const menuItems = [
    {
      group: 'Account',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag },
        { id: 'preferences', label: 'Preferences', icon: Settings },
      ]
    }
  ];

  const getMenuItemClass = (itemId: string) => {
    return activeSection === itemId 
      ? 'bg-primary text-primary-foreground font-medium' 
      : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground';
  };

  return (
    <Sidebar className={`border-r ${state === 'collapsed' ? 'w-14' : 'w-64'}`}>
      <SidebarContent>
        <div className="p-4">
          <Button 
            variant="outline" 
            size="sm"
            asChild
            className="w-full"
          >
            <NavLink to={`/store/${vendorSlug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {state !== 'collapsed' && 'Back to Store'}
            </NavLink>
          </Button>
        </div>

        {menuItems.map((group) => (
          <SidebarGroup key={group.group}>
            {state !== 'collapsed' && (
              <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {group.group}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      className={getMenuItemClass(item.id)}
                    >
                      <button
                        onClick={() => onSectionChange(item.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state !== 'collapsed' && <span className="text-sm">{item.label}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};

export default CustomerSidebar;