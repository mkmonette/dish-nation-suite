import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Vendor } from '@/lib/storage';
import { Star, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  vendor: Vendor;
  template: 'future' | 'neo' | 'premium' | 'modern' | 'classic' | 'minimal' | 'vibrant';
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ vendor, template }) => {
  const reviews = [
    {
      id: '1',
      name: 'Sarah Chen',
      rating: 5,
      text: 'Amazing food and service! The delivery was quick and everything arrived hot and fresh.',
      date: '2 days ago'
    },
    {
      id: '2', 
      name: 'Mike Rodriguez',
      rating: 5,
      text: 'Best restaurant in town! The flavors are incredible and the portions are generous.',
      date: '1 week ago'
    },
    {
      id: '3',
      name: 'Emily Johnson', 
      rating: 4,
      text: 'Great variety of dishes and excellent customer service. Highly recommended!',
      date: '2 weeks ago'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (template === 'future') {
    return (
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <p className="text-lg text-muted-foreground">What our community says</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 backdrop-blur-sm bg-card/60 border border-primary/20 hover:border-primary/40 hover:scale-105 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1 mr-4">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-4 leading-relaxed">{review.text}</p>
                  <div className="font-semibold text-foreground">{review.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === 'neo') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-6 text-foreground">CUSTOMER REVIEWS</h2>
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-primary"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-2 border-primary/30 hover:border-primary shadow-lg hover:shadow-primary/25 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1 mr-4">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground font-bold">{review.date}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed font-medium">{review.text}</p>
                  <div className="font-black text-foreground uppercase">— {review.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Premium template
  return (
    <section className="py-24 border-y border-primary/10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-2xl font-light text-foreground tracking-wider mb-8">Testimonials</h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <div key={review.id} className="text-center p-6 hover:bg-muted/20 transition-colors duration-700 rounded-lg">
              <div className="flex justify-center space-x-1 mb-6">
                {renderStars(review.rating)}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed font-light italic">{review.text}</p>
              <div className="text-foreground font-light">{review.name}</div>
              <div className="text-xs text-muted-foreground mt-2">{review.date}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;