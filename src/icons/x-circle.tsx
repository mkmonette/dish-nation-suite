import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const XCircle: React.FC<IconProps> = ({ 
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
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
};

export default XCircle;