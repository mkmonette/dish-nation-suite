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
      name: 'Emma Wilson',
      rating: 4,
      text: 'Great experience overall. The food quality is consistently excellent.',
      date: '2 weeks ago'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (template === 'modern') {
    return (
      <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Customer Reviews
            </h2>
            <p className="text-lg text-muted-foreground">What our customers are saying</p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="border-0 bg-card/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(review.rating)}
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  <p className="text-muted-foreground mb-4 leading-relaxed">"{review.text}"</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{review.name}</span>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
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
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-foreground">Guest Testimonials</h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-0.5 bg-primary"></div>
              <div className="w-3 h-3 bg-primary rotate-45"></div>
              <div className="w-12 h-0.5 bg-primary"></div>
            </div>
            <p className="text-xl text-muted-foreground">Voices of satisfied guests</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    {renderStars(review.rating)}
                  </div>
                  <blockquote className="text-muted-foreground text-lg leading-relaxed mb-6 italic">
                    "{review.text}"
                  </blockquote>
                  <div className="border-t border-primary/20 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-semibold text-foreground">{review.name}</span>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Minimal template
  return (
    <section className="py-20 border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-extralight text-primary tracking-wider mb-8">Reviews</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto"></div>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-12">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border/20 pb-8 last:border-b-0">
              <div className="flex items-center gap-2 mb-4">
                {renderStars(review.rating)}
              </div>
              <p className="text-muted-foreground font-light leading-relaxed mb-6 text-lg">
                "{review.text}"
              </p>
              <div className="flex items-center justify-between">
                <span className="font-light text-foreground tracking-wide">{review.name}</span>
                <span className="text-sm text-muted-foreground font-light">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;