import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Vendor } from '@/lib/storage';
import { getDefaultPlaceholder } from '@/utils/imageUtils';

interface ReviewsSectionProps {
  vendor: Vendor;
  template: 'modern-glass';
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ vendor, template }) => {
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      name: 'Maria Santos',
      rating: 5,
      comment: 'Absolutely amazing food! The flavors are incredible and delivery was super fast. Will definitely order again!',
      date: '2 days ago',
      avatar: getDefaultPlaceholder('profile')
    },
    {
      id: 2,
      name: 'Juan Dela Cruz',
      rating: 5,
      comment: 'Best restaurant in the area! Fresh ingredients, generous portions, and excellent customer service.',
      date: '1 week ago',
      avatar: getDefaultPlaceholder('profile')
    },
    {
      id: 3,
      name: 'Sofia Rodriguez',
      rating: 4,
      comment: 'Really good food and reasonable prices. The packaging was great and everything arrived hot.',
      date: '2 weeks ago',
      avatar: getDefaultPlaceholder('profile')
    }
  ];

  if (template === 'modern-glass') {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 inline-block shadow-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  What Our Customers Say
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Real reviews from real customers who love our food
              </p>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div 
                key={review.id}
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/15"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Quote icon */}
                <div className="mb-6">
                  <Quote className="w-8 h-8 text-indigo-500 opacity-60" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < review.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{review.comment}"
                </p>

                {/* Reviewer info */}
                <div className="flex items-center gap-4">
                  <img 
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                </div>

                {/* Floating decoration */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Overall rating display */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 inline-block shadow-xl">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-yellow-500 mb-2">4.9</div>
                  <div className="flex gap-1 justify-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
                <div className="w-px h-16 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600 mb-2">500+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="w-px h-16 bg-gray-300 hidden sm:block"></div>
                <div className="text-center hidden sm:block">
                  <div className="text-5xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"{review.comment}"</p>
              <div className="font-semibold">{review.name}</div>
              <div className="text-sm text-gray-500">{review.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;