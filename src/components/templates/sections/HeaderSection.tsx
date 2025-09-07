import React from 'react';

interface HeaderSectionProps {
  headerComponent: React.ReactNode;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ headerComponent }) => {
  return <>{headerComponent}</>;
};

export default HeaderSection;