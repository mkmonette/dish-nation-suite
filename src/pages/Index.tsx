import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { vendorStorage } from '@/lib/storage';
import { Search, Store, Users, ShoppingBag } from 'lucide-react';

const Index = () => {
  const [searchSlug, setSearchSlug] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchSlug.trim()) {
      navigate(`/store/${searchSlug.trim().toLowerCase()}`);
    }
  };

  const vendors = vendorStorage.getAll().slice(0, 6); // Show first 6 vendors

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground">FoodSaaS</span>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/vendor/auth')}
            className="bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30"
          >
            Vendor Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
          Multi-Tenant Food Delivery
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
          Each vendor gets their own storefront. Customers register separately for each store they want to order from.
        </p>

        {/* Store Search */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                placeholder="Enter store name (e.g., 'joes-pizza')"
                className="pl-10 bg-white/20 border-white/30 text-primary-foreground placeholder:text-primary-foreground/70"
              />
            </div>
            <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Visit Store
            </Button>
          </form>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-white/10 border-white/20 text-primary-foreground">
            <CardHeader>
              <Store className="h-12 w-12 mx-auto mb-4" />
              <CardTitle>Multi-Tenant Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/80">
                Each vendor gets their own isolated storefront with custom branding and menu management.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-primary-foreground">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto mb-4" />
              <CardTitle>Dual Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/80">
                Separate login systems for vendors and customers, with tenant-isolated customer accounts.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-primary-foreground">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
              <CardTitle>Complete Ordering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-foreground/80">
                Full featured ordering system with menu management, cart functionality, and order tracking.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={() => navigate('/vendor/auth')}
            className="min-w-48"
          >
            Start Your Store
          </Button>
          <Button 
            variant="secondary" 
            size="xl" 
            className="bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30 min-w-48"
            onClick={() => {
              if (vendors.length > 0) {
                navigate(`/store/${vendors[0].slug}`);
              }
            }}
          >
            Browse Stores
          </Button>
          <Button 
            variant="outline" 
            size="xl" 
            className="bg-white/10 text-primary-foreground border-white/30 hover:bg-white/20 min-w-48"
            onClick={() => navigate('/admin/auth')}
          >
            Admin Portal
          </Button>
        </div>
      </section>

      {/* Sample Stores */}
      {vendors.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">
            Featured Stores
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <Card 
                key={vendor.id} 
                className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer"
                onClick={() => navigate(`/store/${vendor.slug}`)}
              >
                <CardHeader>
                  <CardTitle className="text-primary-foreground">{vendor.storeName}</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    {vendor.description || 'Delicious food delivered to your door'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" size="sm" className="w-full">
                    Visit Store
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20">
        <div className="text-center text-primary-foreground/70">
          <p>&copy; 2024 FoodSaaS. Multi-tenant food delivery platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
