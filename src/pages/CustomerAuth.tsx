import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '@/contexts/CustomerContext';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Checkbox } from '@/components/ui/checkbox';
import { vendorStorage } from '@/lib/storage';

const CustomerAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { vendorSlug } = useParams();
  const { login, register, customer } = useCustomer();
  const { currentTenant, setTenant } = useTenant();
  const navigate = useNavigate();

  const vendor = React.useMemo(() => {
    if (!vendorSlug) return null;
    return vendorStorage.getBySlug(vendorSlug);
  }, [vendorSlug]);

  React.useEffect(() => {
    if (!vendor) {
      navigate('/');
      return;
    }

    if (!currentTenant || currentTenant.id !== vendor.id) {
      setTenant(vendor.slug);
    }

    if (customer && customer.vendorId === vendor.id) {
      navigate(`/store/${vendor.slug}`);
    }
  }, [vendor, customer, navigate, currentTenant, setTenant]);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Store not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const success = await login(email, password, vendor.id);
    
    if (success) {
      toast({ title: 'Welcome back!', description: `You're now logged in to ${vendor.storeName}.` });
      navigate(`/store/${vendor.slug}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: 'Invalid email or password for this store.',
      });
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password mismatch',
        description: 'Passwords do not match. Please try again.',
      });
      setIsLoading(false);
      return;
    }

    const success = await register({ email, password, name, phone }, vendor.id);
    
    if (success) {
      toast({ 
        title: 'Account created!', 
        description: `Welcome ${name}! You can now order from ${vendor.storeName}.` 
      });
      navigate(`/store/${vendor.slug}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: 'Email already exists for this store. Please try logging in instead.',
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{vendor.storeName}</CardTitle>
          <CardDescription>
            Login or create an account to start ordering
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="customer@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  variant="order" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="customer@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number</Label>
                  <Input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirmPassword">Confirm Password</Label>
                  <Input
                    id="register-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Marketing Preferences */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Marketing Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-marketing"
                        name="emailMarketing"
                        defaultChecked={true}
                      />
                      <Label htmlFor="email-marketing" className="text-sm">
                        Email me about special offers and promotions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="push-notifications"
                        name="pushNotifications"
                        defaultChecked={true}
                      />
                      <Label htmlFor="push-notifications" className="text-sm">
                        Send me order updates and notifications
                      </Label>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="order" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-4 border-t text-center">
            <Button 
              variant="link" 
              onClick={() => navigate(`/store/${vendor.slug}`)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Continue as guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAuth;