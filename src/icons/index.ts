// Named exports for all icons
export { default as ShoppingCartOutline } from './shopping-cart-outline';
export { default as HeartOutline } from './heart-outline';
export { default as UserOutline } from './user-outline';
export { default as StarOutline } from './star-outline';
export { default as CheckCircle } from './check-circle';
export { default as XCircle } from './x-circle';
export { default as Plus } from './plus';
export { default as Minus } from './minus';
export { default as Home } from './home';
export { default as Search } from './search';
export { default as Menu } from './menu';
export { default as Bell } from './bell';

// Icon name mapping for dynamic imports
export const iconMap = {
  'shopping-cart-outline': 'ShoppingCartOutline',
  'heart-outline': 'HeartOutline',
  'user-outline': 'UserOutline',
  'star-outline': 'StarOutline',
  'check-circle': 'CheckCircle',
  'x-circle': 'XCircle',
  'plus': 'Plus',
  'minus': 'Minus',
  'home': 'Home',
  'search': 'Search',
  'menu': 'Menu',
  'bell': 'Bell',
} as const;

export type IconName = keyof typeof iconMap;