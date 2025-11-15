import React from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Vendor, SectionConfig } from '@/lib/storage';
import { Facebook, Instagram, Twitter, Heart, MapPin, Phone } from 'lucide-react';

interface FooterSectionProps {
  vendor: Vendor;
  cartComponent: React.ReactNode;
  template: 'modern-glass' | 'sleek-minimal';
  section?: SectionConfig;
}

const FooterSection: React.FC<FooterSectionProps> = ({ vendor, cartComponent, template, section }) => {
  const currentYear = new Date().getFullYear();

  if (template === 'modern-glass') {
    return (
      <footer className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Main footer content */}
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand section */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    {vendor.storeName}
                  </span>
                </h2>
                <p className="text-white/80 leading-relaxed max-w-md">
                  {vendor.description || 
                    'Experience exceptional food and service. We\'re passionate about bringing you the best flavors with fresh ingredients.'
                  }
                </p>
                
                {/* Social links */}
                <div className="flex gap-4">
                  <Button 
                    size="sm" 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl w-12 h-12 p-0"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl w-12 h-12 p-0"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm rounded-xl w-12 h-12 p-0"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick links */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Quick Links</h3>
                <ul className="space-y-3 text-white/80">
                  <li><a href="#menu" className="hover:text-white transition-colors duration-200">Menu</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors duration-200">About Us</a></li>
                  <li><a href="#reviews" className="hover:text-white transition-colors duration-200">Reviews</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a></li>
                  <li><a href="#offers" className="hover:text-white transition-colors duration-200">Special Offers</a></li>
                </ul>
              </div>

              {/* Contact info */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Contact Info</h3>
                <div className="space-y-4 text-white/80">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                    <div>
                      <p>123 Food Street</p>
                      <p>Makati City, Metro Manila</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <p>+63 917 123 4567</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-sm font-medium">Business Hours</p>
                    <p className="text-sm">Mon-Fri: 9AM - 10PM</p>
                    <p className="text-sm">Sat-Sun: 9AM - 11PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="mt-16 pt-8 border-t border-white/20">
              <div className="text-center max-w-2xl mx-auto space-y-6">
                <h3 className="text-2xl font-bold">Stay Updated</h3>
                <p className="text-white/80">Subscribe to get updates on new menu items and special offers</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-xl px-8">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/20 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60">
                <p>© {currentYear} {vendor.storeName}. All rights reserved.</p>
                <div className="flex items-center gap-2">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                  <span>for food lovers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating cart */}
        <div className="fixed bottom-6 right-6 z-50">
          {cartComponent}
        </div>
      </footer>
    );
  }

  // Default fallback
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{vendor.storeName}</h3>
            <p className="text-gray-400">
              {vendor.description || 'Delicious food delivered to your door'}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Menu</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">+63 917 123 4567</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} {vendor.storeName}. All rights reserved.</p>
        </div>
      </div>
      {cartComponent}
    </footer>
  );
};

export default FooterSection;