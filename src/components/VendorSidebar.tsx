import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  FolderTree, 
  Palette, 
  Percent, 
  Bell, 
  Mail, 
  Users, 
  Star, 
  CreditCard,
  Settings,
  User
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

interface VendorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const VendorSidebar: React.FC<VendorSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { state } = useSidebar();

  const menuItems = [
    {
      group: 'Core',
      items: [
        { id: 'overview', label: 'Dashboard', icon: Home },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'menu', label: 'Menu Items', icon: Package },
        { id: 'categories', label: 'Categories', icon: FolderTree },
      ]
    },
    {
      group: 'Marketing',
      items: [
        { id: 'discounts', label: 'Discounts', icon: Percent },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'loyalty', label: 'Loyalty Program', icon: Star },
      ]
    },
    {
      group: 'Settings',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'storefront', label: 'Storefront', icon: Palette },
        { id: 'subscription', label: 'Subscription', icon: CreditCard },
        { id: 'settings', label: 'Settings', icon: Settings },
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

export default VendorSidebar;