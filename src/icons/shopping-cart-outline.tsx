import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const ShoppingCartOutline: React.FC<IconProps> = ({ 
  width = 24, 
  height = 24, 
  color = 'currentColor',
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="m1 1 4 4 5.5 11h8a2 2 0 0 0 2-1.73l-3-7H6"/>
    </svg>
  );
};

export default ShoppingCartOutline;