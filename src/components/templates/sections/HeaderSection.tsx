import React from 'react';

interface HeaderSectionProps {
  headerComponent: React.ReactNode;
  template?: 'modern-glass';
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ headerComponent, template }) => {
  // Modern Glass template - mobile-first floating header
  if (template === 'modern-glass') {
    return (
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="h-18 md:h-20 flex items-center justify-between relative">
            {/* Dynamic glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-emerald-600/10"></div>
            
            {/* Subtle floating decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-4 left-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse"></div>
              <div className="absolute top-6 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            <div className="relative z-10 w-full flex items-center justify-between">
              {headerComponent}
            </div>
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