import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Star, Upload, X, CreditCard, Smartphone } from 'lucide-react';
import { Vendor, ManualPaymentMethod } from '@/lib/storage';
import { getEnabledGateways } from '@/lib/paymentGateways';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor;
  cart: Array<{
    menuItem: any;
    quantity: number;
    selectedVariation?: any;
    selectedAddOns?: any[];
  }>;
  cartTotal: number;
  customer: any;
  loyaltySettings: any;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  vendor,
  cart,
  cartTotal,
  customer,
  loyaltySettings,
  onSubmit,
  isLoading
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [paymentProof, setPaymentProof] = useState<string>('');

  const enabledPaymentMethods = vendor.manualPaymentMethods?.filter(method => method.enabled) || [];
  const hasManualPayment = vendor.manualPaymentEnabled && enabledPaymentMethods.length > 0;
  const enabledGateways = getEnabledGateways();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Add payment proof if manual payment
    const paymentMethod = formData.get('paymentMethod') as string;
    if (paymentMethod === 'manual_payment') {
      if (!selectedPaymentMethod) {
        toast({
          title: 'Payment method required',
          description: 'Please select a manual payment method.',
          variant: 'destructive'
        });
        return;
      }
      
      if (!paymentProof) {
        toast({
          title: 'Payment proof required',
          description: 'Please upload proof of payment.',
          variant: 'destructive'
        });
        return;
      }
      
      formData.append('selectedPaymentMethod', selectedPaymentMethod);
      
      // Create a file from base64 and append it
      const response = await fetch(paymentProof);
      const blob = await response.blob();
      const file = new File([blob], 'payment_proof.jpg', { type: 'image/jpeg' });
      formData.append('paymentProof', file);
    }

    await onSubmit(formData);
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Payment proof file size must be less than 2MB',
        variant: 'destructive'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPaymentProof(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const content = (
    <div className="space-y-6">
      <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={customer?.name || ''}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Enter your complete address"
              rows={2}
            />
          </div>
        </div>

        {/* Order Type */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Order Type</h3>
          <RadioGroup name="orderType" defaultValue="delivery">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="delivery" id="delivery" />
              <Label htmlFor="delivery">Delivery</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup">Pickup</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Payment Method</h3>
          <RadioGroup name="paymentMethod" defaultValue="pay_on_delivery">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
              <Label htmlFor="pay_on_delivery">Pay on Delivery</Label>
            </div>
            
            {/* Online Payment Gateways */}
            {enabledGateways.map((gateway) => (
              <div key={gateway.name} className="flex items-center space-x-2">
                <RadioGroupItem value={gateway.name} id={gateway.name} />
                <Label htmlFor={gateway.name} className="flex items-center gap-2">
                  {gateway.name === 'stripe' && <CreditCard className="h-4 w-4" />}
                  {gateway.name === 'paypal' && <div className="h-4 w-4 bg-blue-600 rounded-full" />}
                  {gateway.name === 'paymongo' && <Smartphone className="h-4 w-4" />}
                  {gateway.displayName}
                  {gateway.testMode && <span className="text-xs bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded">TEST</span>}
                </Label>
              </div>
            ))}
            
            {hasManualPayment && (
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual_payment" id="manual_payment" />
                <Label htmlFor="manual_payment">Manual Payment</Label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Manual Payment Options */}
        {hasManualPayment && (
          <div className="space-y-4" id="manual-payment-section">
            <h4 className="font-medium">Select Payment Method</h4>
            <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              {enabledPaymentMethods.map((method) => (
                <div key={method.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Label htmlFor={method.id} className="font-medium">{method.title}</Label>
                  </div>
                  
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {method.instructions}
                  </div>
                  
                  {method.qrCode && (
                    <div className="flex justify-center">
                      <img 
                        src={method.qrCode} 
                        alt="QR Code" 
                        className="max-w-48 max-h-48 rounded border"
                      />
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>

            {/* Payment Proof Upload */}
            <div className="space-y-2">
              <Label>Upload Payment Proof *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {paymentProof ? (
                  <div className="space-y-2">
                    <img src={paymentProof} alt="Payment proof" className="max-w-32 max-h-32 mx-auto rounded" />
                    <div className="flex gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('payment-proof-upload')?.click()}
                      >
                        Replace
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPaymentProof('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload payment proof<br />
                      PNG/JPG, max 2MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('payment-proof-upload')?.click()}
                    >
                      Upload Proof
                    </Button>
                  </div>
                )}
                <input
                  id="payment-proof-upload"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Order Notes (Optional)</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special instructions for your order..."
            rows={2}
          />
        </div>
      </form>

      {/* Order Summary */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="font-semibold text-lg">Order Summary</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cart.map((item, index) => {
            const itemPrice = item.selectedVariation?.price || item.menuItem.price;
            const addOnsPrice = item.selectedAddOns?.reduce((sum: number, addOn: any) => sum + addOn.price, 0) || 0;
            const totalItemPrice = itemPrice + addOnsPrice;
            
            return (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.quantity}x {item.menuItem.name}
                  {item.selectedVariation && ` (${item.selectedVariation.name})`}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <span className="text-muted-foreground">
                      {' + '}{item.selectedAddOns.map((addOn: any) => addOn.name).join(', ')}
                    </span>
                  )}
                </span>
                <span className="font-medium">₱{(totalItemPrice * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
        </div>

        {/* Loyalty Points */}
        {customer && loyaltySettings?.isActive && (
          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Available Points: {customer.loyaltyPoints || 0}</span>
            </div>
            {loyaltySettings.redemptionRules.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Redeem: {loyaltySettings.redemptionRules.map((rule: any) => 
                  `${rule.pointsRequired} pts = ₱${rule.discountAmount} off`
                ).join(', ')}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between text-lg font-semibold border-t pt-3">
          <span>Total</span>
          <span>₱{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`flex gap-3 ${isMobile ? 'sticky bottom-0 bg-background pt-4 border-t' : ''}`}>
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          form="checkout-form"
          variant="default" 
          size="lg" 
          className="flex-1" 
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : `Place Order - ₱${cartTotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh] overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>Checkout - {vendor.storeName}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout - {vendor.storeName}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;