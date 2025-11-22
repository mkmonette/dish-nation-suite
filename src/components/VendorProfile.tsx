import React, { useState } from 'react';
import { useVendor } from '@/contexts/VendorContext';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { BusinessHours, ContactDetails } from '@/lib/storage';
import { Clock, MapPin, Phone, Mail, Save, Building2 } from 'lucide-react';

const defaultBusinessHours: BusinessHours[] = [
  { day: 'Monday', open: '09:00', close: '17:00', isClosed: false },
  { day: 'Tuesday', open: '09:00', close: '17:00', isClosed: false },
  { day: 'Wednesday', open: '09:00', close: '17:00', isClosed: false },
  { day: 'Thursday', open: '09:00', close: '17:00', isClosed: false },
  { day: 'Friday', open: '09:00', close: '17:00', isClosed: false },
  { day: 'Saturday', open: '10:00', close: '16:00', isClosed: false },
  { day: 'Sunday', open: '10:00', close: '16:00', isClosed: true },
];

const VendorProfile: React.FC = () => {
  const { vendor, updateVendor } = useVendor();
  const [isLoading, setIsLoading] = useState(false);
  
  // Store Information
  const [storeName, setStoreName] = useState(vendor?.storeName || '');
  const [description, setDescription] = useState(vendor?.description || '');
  
  // Contact Details
  const [contactDetails, setContactDetails] = useState<ContactDetails>(
    vendor?.contactDetails || {}
  );
  
  // Business Hours
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>(
    vendor?.businessHours || defaultBusinessHours
  );

  if (!vendor) return null;

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessHoursChange = (index: number, field: keyof BusinessHours, value: string | boolean) => {
    setBusinessHours(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const success = await updateVendor({
        storeName,
        description,
        contactDetails,
        businessHours,
      });

      if (success) {
        toast({
          title: 'Profile updated',
          description: 'Your store profile has been updated successfully.',
        });
      } else {
        toast({
          title: 'Update failed',
          description: 'Failed to update your profile. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>
            Update your store name and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Enter your store name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your store..."
              rows={4}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm text-muted-foreground">Store URL</Label>
            <div className="mt-1 p-3 bg-muted rounded-md">
              <code className="text-sm">{window.location.origin}/store/{vendor.slug}</code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Manage your contact details that customers can see
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={contactDetails.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactDetails.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="contact@yourstore.com"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Street Address</Label>
            <Input
              id="address"
              value={contactDetails.address || ''}
              onChange={(e) => handleContactChange('address', e.target.value)}
              placeholder="123 Main Street"
              className="mt-1"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={contactDetails.city || ''}
                onChange={(e) => handleContactChange('city', e.target.value)}
                placeholder="New York"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={contactDetails.state || ''}
                onChange={(e) => handleContactChange('state', e.target.value)}
                placeholder="NY"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={contactDetails.zipCode || ''}
                onChange={(e) => handleContactChange('zipCode', e.target.value)}
                placeholder="10001"
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={contactDetails.country || ''}
              onChange={(e) => handleContactChange('country', e.target.value)}
              placeholder="United States"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Business Hours
          </CardTitle>
          <CardDescription>
            Set your operating hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {businessHours.map((hours, index) => (
            <div key={hours.day} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
              <div className="w-28 font-medium">{hours.day}</div>
              
              <div className="flex-1 flex items-center gap-2">
                {!hours.isClosed ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`open-${index}`} className="text-xs text-muted-foreground">
                        Open
                      </Label>
                      <Input
                        id={`open-${index}`}
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(index, 'open', e.target.value)}
                        className="w-32"
                      />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`close-${index}`} className="text-xs text-muted-foreground">
                        Close
                      </Label>
                      <Input
                        id={`close-${index}`}
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(index, 'close', e.target.value)}
                        className="w-32"
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-muted-foreground">Closed</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Label htmlFor={`closed-${index}`} className="text-sm">
                  Closed
                </Label>
                <Switch
                  id={`closed-${index}`}
                  checked={hours.isClosed}
                  onCheckedChange={(checked) => handleBusinessHoursChange(index, 'isClosed', checked)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          size="lg"
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default VendorProfile;
