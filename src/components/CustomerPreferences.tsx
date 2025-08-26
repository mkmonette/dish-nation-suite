import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/enhanced-button';
import { toast } from '@/hooks/use-toast';
import { customerStorage, Customer } from '@/lib/storage';
import { Bell, Mail, MessageSquare, Settings } from 'lucide-react';

interface CustomerPreferencesProps {
  customer: Customer;
  vendorId: string;
  onUpdate?: (customer: Customer) => void;
}

const CustomerPreferences: React.FC<CustomerPreferencesProps> = ({ 
  customer, 
  vendorId, 
  onUpdate 
}) => {
  const [preferences, setPreferences] = useState(customer.marketingPreferences || {
    emailMarketing: true,
    pushNotifications: true,
    smsMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPreferences(customer.marketingPreferences || {
      emailMarketing: true,
      pushNotifications: true,
      smsMarketing: false,
    });
  }, [customer]);

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    
    const updatedCustomer = customerStorage.update(customer.id, {
      marketingPreferences: preferences
    }, vendorId);

    if (updatedCustomer) {
      onUpdate?.(updatedCustomer);
      toast({
        title: "Preferences updated",
        description: "Your marketing preferences have been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Marketing Preferences
        </CardTitle>
        <CardDescription>
          Choose how you'd like to receive updates and promotions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-marketing" className="text-sm font-medium">
                  Email Marketing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive promotional emails, special offers, and newsletters
                </p>
              </div>
            </div>
            <Switch
              id="email-marketing"
              checked={preferences.emailMarketing}
              onCheckedChange={(value) => handlePreferenceChange('emailMarketing', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="push-notifications" className="text-sm font-medium">
                  Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Order updates, delivery notifications, and reminders
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.pushNotifications}
              onCheckedChange={(value) => handlePreferenceChange('pushNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="sms-marketing" className="text-sm font-medium">
                  SMS Marketing
                </Label>
                <p className="text-xs text-muted-foreground">
                  Text messages with exclusive deals and order updates
                </p>
              </div>
            </div>
            <Switch
              id="sms-marketing"
              checked={preferences.smsMarketing}
              onCheckedChange={(value) => handlePreferenceChange('smsMarketing', value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleSavePreferences} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerPreferences;