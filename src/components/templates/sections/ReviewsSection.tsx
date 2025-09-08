import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Vendor } from '@/lib/storage';
import { Star, Quote } from 'lucide-react';

interface ReviewsSectionProps {
  vendor: Vendor;
  template: 'modern' | 'classic' | 'minimal';
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ vendor, template }) => {
  // Sample reviews data - in a real app this would come from props or API
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

  // Show placeholder if no reviews available
  if (reviews.length === 0) {
    if (template === 'modern') {
      return (
        <section className="py-20 bg-background/60 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Customer Reviews
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Be the first to share your experience! Your feedback helps us serve you better.
              </p>
            </div>
          </div>
        </section>
      );
    }
    
    if (template === 'classic') {
      return (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-primary">
                Customer Reviews
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your testimonials will be featured here. Share your dining experience with us!
              </p>
            </div>
          </div>
        </section>
      );
    }
    
    if (template === 'minimal') {
      return (
        <section className="py-16 bg-background border-b">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">
                Reviews
              </h2>
              <div className="w-16 h-px bg-primary mx-auto mb-8"></div>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Customer reviews will appear here
              </p>
            </div>
          </div>
        </section>
      );
    }
  }

  if (template === 'modern') {
    return (
      <section className="py-20 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <p className="text-lg text-muted-foreground">What our customers say</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border-0 bg-card/60 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
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

  if (template === 'classic') {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-primary">
              Customer Reviews
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground">Testimonials from our valued guests</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 border border-primary/20 bg-background hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-1 mr-4">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground mb-4 leading-relaxed italic">{review.text}</p>
                  <div className="font-semibold text-foreground font-serif">— {review.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (template === 'minimal') {
    return (
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">
              Reviews
            </h2>
            <div className="w-16 h-px bg-primary mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="text-center p-6 hover:bg-muted/30 transition-colors duration-300 rounded-lg">
                <div className="flex justify-center space-x-1 mb-4">
                  {renderStars(review.rating)}
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{review.text}</p>
                <div className="text-foreground font-medium">{review.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{review.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return null;
};

export default ReviewsSection;