import React from 'react';
import { Vendor, SectionConfig } from '@/lib/storage';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';

interface BusinessInfoSectionProps {
  vendor: Vendor;
  template: 'modern-glass' | 'sleek-minimal';
  section?: SectionConfig;
}

const BusinessInfoSection: React.FC<BusinessInfoSectionProps> = ({ vendor, template, section }) => {
  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visit Us
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find us, contact us, or visit our location
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact information */}
            <div className="space-y-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h3>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Location</h4>
                      <p className="text-gray-600 leading-relaxed">
                        123 Food Street, Makati City<br />
                        Metro Manila, Philippines 1200
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Phone</h4>
                      <p className="text-gray-600">+63 917 123 4567</p>
                      <p className="text-sm text-gray-500 mt-1">Available 9AM - 10PM daily</p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Email</h4>
                      <p className="text-gray-600">hello@{vendor.slug}.com</p>
                      <p className="text-sm text-gray-500 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Hours */}
                <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white/15">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">Operating Hours</h4>
                      <div className="space-y-1 text-gray-600">
                        <p>Monday - Friday: 9:00 AM - 10:00 PM</p>
                        <p>Saturday - Sunday: 9:00 AM - 11:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder and about */}
            <div className="space-y-8">
              {/* Map */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Find Us Here</h3>
                <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">Click to view location</p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">About {vendor.storeName}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {vendor.storefront?.aboutUs || 
                    `${vendor.storeName} has been serving delicious, authentic food since our founding. We're passionate about bringing you the best flavors with fresh ingredients and exceptional service.`
                  }
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold text-indigo-600">5+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-600">Menu Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4 text-gray-600">
              <p>📍 123 Food Street, Makati City</p>
              <p>📞 +63 917 123 4567</p>
              <p>✉️ hello@{vendor.slug}.com</p>
              <p>🕒 9:00 AM - 10:00 PM Daily</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">
              {vendor.storefront?.aboutUs || 
                `${vendor.storeName} serves delicious, authentic food with fresh ingredients and exceptional service.`
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessInfoSection;