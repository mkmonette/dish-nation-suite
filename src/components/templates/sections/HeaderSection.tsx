import React from 'react';

interface HeaderSectionProps {
  headerComponent: React.ReactNode;
  template?: 'modern-glass';
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ headerComponent, template }) => {
  // Modern Glass template - floating glassmorphism header
  if (template === 'modern-glass') {
    return (
      <header className="sticky top-4 z-50 mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10">
          <div className="bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-2xl">
            {headerComponent}
          </div>
        </div>
      </header>
    );
  }

  // Default fallback
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      {headerComponent}
    </header>
  );
};

export default HeaderSection;