import React from 'react';
import { 
  Home, 
  Users, 
  UserCheck, 
  CreditCard, 
  DollarSign, 
  Settings,
  Building,
  TrendingUp,
  Image
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

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const { state } = useSidebar();

  const menuItems = [
    {
      group: 'Overview',
      items: [
        { id: 'overview', label: 'Dashboard', icon: Home },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
      ]
    },
    {
      group: 'Management',
      items: [
        { id: 'vendors', label: 'Vendors', icon: Building },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'icons', label: 'Icon Library', icon: Image },
      ]
    },
    {
      group: 'Financial',
      items: [
        { id: 'payments', label: 'Payments', icon: DollarSign },
      ]
    },
    {
      group: 'System',
      items: [
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

export default AdminSidebar;