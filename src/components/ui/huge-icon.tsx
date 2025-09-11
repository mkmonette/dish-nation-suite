import React from 'react';
import { IconName } from '@/icons';

// Dynamic imports for tree-shaking - only imported icons will be included in bundle
const iconImports: Record<IconName, () => Promise<{ default: React.ComponentType<any> }>> = {
  'shopping-cart-outline': () => import('@/icons/shopping-cart-outline'),
  'heart-outline': () => import('@/icons/heart-outline'),
  'user-outline': () => import('@/icons/user-outline'),
  'star-outline': () => import('@/icons/star-outline'),
  'check-circle': () => import('@/icons/check-circle'),
  'x-circle': () => import('@/icons/x-circle'),
  'plus': () => import('@/icons/plus'),
  'minus': () => import('@/icons/minus'),
  'home': () => import('@/icons/home'),
  'search': () => import('@/icons/search'),
  'menu': () => import('@/icons/menu'),
  'bell': () => import('@/icons/bell'),
};

interface HugeIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}

const HugeIcon: React.FC<HugeIconProps> = ({ 
  name, 
  size = 24, 
  color = 'currentColor',
  className = ''
}) => {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadIcon = async () => {
      if (!iconImports[name]) {
        setIconComponent(null);
        return;
      }

      setIsLoading(true);
      try {
        const iconModule = await iconImports[name]();
        setIconComponent(() => iconModule.default);
      } catch (error) {
        console.warn(`Failed to load icon: ${name}`);
        setIconComponent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadIcon();
  }, [name]);

  if (isLoading) {
    return (
      <div 
        className={`inline-block ${className}`}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'transparent',
          borderRadius: '2px'
        }} 
      />
    );
  }

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent 
      width={size} 
      height={size} 
      color={color}
      className={className}
    />
  );
};

export default HugeIcon;
export type { IconName };