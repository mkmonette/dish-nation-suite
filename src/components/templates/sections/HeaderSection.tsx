import React from 'react';

interface HeaderSectionProps {
  headerComponent: React.ReactNode;
  template?: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ headerComponent, template }) => {
  // Template 1: Minimalist - Non-sticky, minimal header
  if (template === 'future') {
    return (
      <header className="relative bg-white border-b border-gray-100">
        {headerComponent}
      </header>
    );
  }

  // Template 2: Bold & Visual - Full-width sticky header with gradient
  if (template === 'neo') {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600/95 via-purple-600/95 to-pink-600/95 backdrop-blur-md shadow-lg">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative">
          {headerComponent}
        </div>
      </header>
    );
  }

  // Template 3: Storytelling - Elegant centered header with decorative elements
  if (template === 'premium') {
    return (
      <header className="relative bg-gradient-to-b from-slate-900 to-slate-800 border-b-2 border-amber-400/30">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>
        <div className="relative">
          {headerComponent}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
      </header>
    );
  }

  // Template 4: Playful - Rounded header with modern styling
  if (template === 'modern') {
    return (
      <header className="sticky top-4 z-50 mx-4">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-emerald-200">
          {headerComponent}
        </div>
      </header>
    );
  }

  // Template 5: Elegant - Traditional header with serif styling
  if (template === 'classic') {
    return (
      <header className="relative bg-gradient-to-b from-amber-50 to-orange-50 border-b-4 border-amber-600">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 53, 15, 0.03) 0%, transparent 50%)`
        }}></div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600"></div>
        <div className="relative">
          {headerComponent}
        </div>
      </header>
    );
  }

  // Template 6: Compact - Ultra-minimal header
  if (template === 'minimal') {
    return (
      <header className="bg-white border-b border-gray-200">
        {headerComponent}
      </header>
    );
  }

  // Template 7: Premium Showcase - Dynamic animated header
  if (template === 'vibrant') {
    return (
      <header className="sticky top-0 z-50 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-8 h-8 bg-yellow-400 rounded-full blur-lg opacity-60 animate-pulse"></div>
          <div className="absolute top-2 right-1/4 w-6 h-6 bg-green-400 rounded-full blur-md opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="relative">
          {headerComponent}
        </div>
      </header>
    );
  }

  // Default fallback
  return (
    <header className="relative">
      {headerComponent}
    </header>
  );
};

export default HeaderSection;