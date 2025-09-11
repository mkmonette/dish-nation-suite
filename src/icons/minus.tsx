import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const Minus: React.FC<IconProps> = ({ 
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
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
};

export default Minus;