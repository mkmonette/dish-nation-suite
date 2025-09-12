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
  name: string; // Accept any string, not just IconName
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
  const [uploadedIconUrl, setUploadedIconUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const loadIcon = async () => {
      setIsLoading(true);
      setIconComponent(null);
      setUploadedIconUrl(null);

      // First, try to load from bundled icons
      if (iconImports[name as IconName]) {
        try {
          const iconModule = await iconImports[name as IconName]();
          setIconComponent(() => iconModule.default);
          setIsLoading(false);
          return;
        } catch (error) {
          console.warn(`Failed to load bundled icon: ${name}`);
        }
      }

      // Fallback to uploaded icon
      const uploadedPath = `/uploads/icons/${name}.svg`;
      try {
        const response = await fetch(uploadedPath, { method: 'HEAD' });
        if (response.ok) {
          setUploadedIconUrl(uploadedPath);
        }
      } catch (error) {
        console.warn(`Failed to load uploaded icon: ${name}`);
      }

      setIsLoading(false);
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

  // Render bundled icon component
  if (IconComponent) {
    return (
      <IconComponent 
        width={size} 
        height={size} 
        color={color}
        className={className}
      />
    );
  }

  // Render uploaded icon as img
  if (uploadedIconUrl) {
    return (
      <img 
        src={uploadedIconUrl}
        alt={name}
        width={size}
        height={size}
        className={className}
        style={{
          filter: color !== 'currentColor' && color !== 'inherit' 
            ? `brightness(0) saturate(100%) ${getColorFilter(color)}` 
            : undefined
        }}
      />
    );
  }

  return null;
};

// Helper function to convert color to CSS filter (approximate)
const getColorFilter = (color: string): string => {
  // This is a simplified approach - for more accurate color conversion,
  // you might want to use a more sophisticated color conversion library
  const colorMap: Record<string, string> = {
    'red': 'invert(17%) sepia(100%) saturate(7463%) hue-rotate(356deg) brightness(91%) contrast(135%)',
    'blue': 'invert(29%) sepia(100%) saturate(7471%) hue-rotate(217deg) brightness(105%) contrast(142%)',
    'green': 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
    'white': 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)',
    'black': 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)',
  };

  return colorMap[color.toLowerCase()] || '';
};

export default HugeIcon;
export type { IconName };