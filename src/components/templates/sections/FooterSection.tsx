import React from 'react';
import { Vendor } from '@/lib/storage';
import { Star, MapPin, Heart, Award, Clock, Zap, Sparkles, Cpu, ShoppingCart } from 'lucide-react';
import VendorLogo from '@/components/VendorLogo';
import { Button } from '@/components/ui/enhanced-button';

interface FooterSectionProps {
  vendor: Vendor;
  cartComponent: React.ReactNode;
  template: 'basic' | 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const FooterSection: React.FC<FooterSectionProps> = ({ vendor, cartComponent, template }) => {
  // Template 1: Minimalist Footer (future)
  if (template === 'future') {
    return (
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8">
            <h3 className="text-lg font-light text-gray-900">{vendor.name}</h3>
            <div className="w-12 h-px bg-gray-400 mx-auto"></div>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              {vendor.description || "Crafted with precision, served with care"}
            </p>
            <div className="text-xs text-gray-500">
              © {new Date().getFullYear()} {vendor.name}. All rights reserved.
            </div>
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-4 right-4 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 2: Bold & Visual Footer (neo)
  if (template === 'neo') {
    return (
      <footer className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold mb-4">{vendor.name}</h3>
              <p className="text-blue-100 leading-relaxed">
                {vendor.description || "Bold flavors, visual excellence"}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-blue-100">
                <div>Menu</div>
                <div>About Us</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <div className="flex justify-center md:justify-start space-x-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">📱</div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">📧</div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🌐</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-blue-100 text-sm">
            © {new Date().getFullYear()} {vendor.name}. All rights reserved.
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-6 right-6 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 3: Storytelling Footer (premium)
  if (template === 'premium') {
    return (
      <footer className="bg-gradient-to-b from-slate-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block p-4 border-2 border-amber-400/30 rounded-lg">
              <h3 className="text-2xl font-serif font-bold text-amber-400">{vendor.name}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div>
                <h4 className="text-xl font-serif font-semibold text-amber-400 mb-4">Our Story</h4>
                <p className="text-gray-300 leading-relaxed">
                  {vendor.description || "A tale of tradition, innovation, and unforgettable dining experiences"}
                </p>
              </div>
              <div>
                <h4 className="text-xl font-serif font-semibold text-amber-400 mb-4">Visit Us</h4>
                <div className="text-gray-300 space-y-2">
                  <div>📍 Location Details</div>
                  <div>📞 Contact Information</div>
                  <div>🕒 Business Hours</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-4 pt-8">
              <div className="w-8 h-px bg-amber-400"></div>
              <span className="text-amber-400 text-xl">✦</span>
              <div className="w-8 h-px bg-amber-400"></div>
            </div>
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {vendor.name}. Crafted with tradition.
            </div>
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 4: Playful Footer (modern)
  if (template === 'modern') {
    return (
      <footer className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-teal-400/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-emerald-100">{vendor.name}</h3>
              <p className="text-emerald-100 leading-relaxed mb-4">
                {vendor.description || "Fresh, local, sustainable dining experiences"}
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">🌱</div>
                <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">🍃</div>
                <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center">♻️</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-emerald-200">Menu</h4>
              <div className="space-y-2 text-emerald-100 text-sm">
                <div>Today's Specials</div>
                <div>Seasonal Items</div>
                <div>Beverages</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-emerald-200">Info</h4>
              <div className="space-y-2 text-emerald-100 text-sm">
                <div>Delivery Areas</div>
                <div>Nutrition Facts</div>
                <div>Allergen Info</div>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-400/20 mt-8 pt-6 text-center text-emerald-200 text-sm">
            © {new Date().getFullYear()} {vendor.name}. Made with 💚
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-20 right-4 z-50 md:bottom-4">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 5: Elegant Footer (classic)
  if (template === 'classic') {
    return (
      <footer className="bg-gradient-to-b from-amber-50 to-orange-100 py-16 border-t border-amber-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-px bg-amber-600"></div>
                <h3 className="text-2xl font-serif font-bold text-amber-900">{vendor.name}</h3>
                <div className="w-16 h-px bg-amber-600"></div>
              </div>
              <p className="text-amber-800 font-serif italic max-w-2xl mx-auto leading-relaxed">
                {vendor.description || "Preserving culinary traditions with authentic flavors"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <h4 className="font-serif font-semibold text-amber-900 mb-4">Heritage</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Traditional recipes passed down through generations
                </p>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-amber-900 mb-4">Quality</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Only the finest ingredients, carefully sourced
                </p>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-amber-900 mb-4">Experience</h4>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Every meal tells a story of authentic flavors
                </p>
              </div>
            </div>
            <div className="text-center mt-12 pt-8 border-t border-amber-300">
              <div className="text-amber-700 text-sm">
                © {new Date().getFullYear()} {vendor.name}. Established with tradition.
              </div>
            </div>
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-4 right-4 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 6: Compact Footer (minimal)
  if (template === 'minimal') {
    return (
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="font-light text-lg text-black">{vendor.name}</h3>
              <p className="text-gray-600 text-sm font-light">
                {vendor.description || "Simplicity in form. Complexity in flavor."}
              </p>
            </div>
            <div className="text-gray-500 text-xs font-light">
              © {new Date().getFullYear()}
            </div>
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-2 right-2 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Template 7: Premium Showcase Footer (vibrant)
  if (template === 'vibrant') {
    return (
      <footer className="bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {vendor.name}
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            </div>
            <p className="text-xl font-bold max-w-3xl mx-auto leading-relaxed">
              {vendor.description || "EXPLOSIVE FLAVORS! PREMIUM SHOWCASE! UNFORGETTABLE!"}
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="font-bold mb-2">Premium Quality</h4>
                <p className="text-sm opacity-90">Award-winning culinary excellence</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">⚡</div>
                <h4 className="font-bold mb-2">Lightning Fast</h4>
                <p className="text-sm opacity-90">Quick delivery, hot & fresh</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-3xl mb-2">🌟</div>
                <h4 className="font-bold mb-2">5-Star Experience</h4>
                <p className="text-sm opacity-90">Consistently exceptional service</p>
              </div>
            </div>
            <div className="text-white/70 text-sm font-bold">
              © {new Date().getFullYear()} {vendor.name}. PREMIUM EXPERIENCE GUARANTEED! 🚀
            </div>
          </div>
        </div>
        {cartComponent && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            {cartComponent}
          </div>
        )}
      </footer>
    );
  }

  // Default fallback
  return null;
};

export default FooterSection;