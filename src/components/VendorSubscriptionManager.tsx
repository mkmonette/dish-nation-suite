import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { CreditCard, Check, X, FileText, Calendar, DollarSign } from 'lucide-react';
import { subscriptionPlanStorage, vendorSubscriptionStorage, vendorStorage, type VendorSubscription, type SubscriptionPlan } from '../lib/storage';
import { useVendor } from '../contexts/VendorContext';
import { useToast } from '../hooks/use-toast';

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => { render: (selector: string) => void };
    };
  }
}

const VendorSubscriptionManager: React.FC = () => {
  const { vendor, updateVendor } = useVendor();
  const [plans] = useState<SubscriptionPlan[]>(subscriptionPlanStorage.getAll());
  const [currentSubscription, setCurrentSubscription] = useState<VendorSubscription | null>(
    vendor?.subscriptionId ? vendorSubscriptionStorage.getAll().find(s => s.id === vendor.subscriptionId) || null : null
  );
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'manual_payment'>('paypal');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  if (!vendor) return null;

  const getCurrentPlan = (): SubscriptionPlan | null => {
    if (!currentSubscription) return null;
    return plans.find(p => p.id === currentSubscription.planId) || null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPaymentProof(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualPayment = async () => {
    if (!selectedPlan || !paymentProof) return;

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (plan.billingCycle === 'yearly' ? 12 : 1));

      const newSubscription = vendorSubscriptionStorage.create({
        vendorId: vendor.id,
        planId: selectedPlan,
        status: 'pending_payment',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentMethod: 'manual_payment',
        paymentProof,
        autoRenew: false
      });

      await updateVendor({ subscriptionId: newSubscription.id });
      setCurrentSubscription(newSubscription);
      setIsUpgradeOpen(false);

      toast({
        title: "Payment submitted",
        description: "Your payment proof has been submitted for review. Your subscription will be activated once verified.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit payment. Please try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const handlePayPalPayment = async () => {
    if (!selectedPlan) return;

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);

    // Simulate PayPal payment (in real implementation, integrate with PayPal SDK)
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (plan.billingCycle === 'yearly' ? 12 : 1));

      const newSubscription = vendorSubscriptionStorage.create({
        vendorId: vendor.id,
        planId: selectedPlan,
        status: 'active',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        paymentMethod: 'paypal',
        paypalTransactionId: `paypal_${Date.now()}`,
        autoRenew: true
      });

      await updateVendor({ subscriptionId: newSubscription.id });
      setCurrentSubscription(newSubscription);
      setIsUpgradeOpen(false);

      toast({
        title: "Payment successful",
        description: `Your ${plan.name} subscription is now active!`,
      });
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "PayPal payment failed. Please try again.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  const checkPlanLimits = (plan: SubscriptionPlan) => {
    // This would check against actual usage in a real app
    const limits = plan.limits || { maxProducts: 0, maxDiscountCodes: 0, loyaltyProgramAccess: false };
    return {
      productsUsed: 25, // Example data
      discountCodesUsed: 3,
      canUseLoyalty: limits.loyaltyProgramAccess
    };
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Subscription & Billing</h2>
          <p className="text-muted-foreground">Manage your subscription plan and payment method</p>
        </div>
        {currentSubscription && (
          <Button onClick={() => setIsUpgradeOpen(true)}>
            Upgrade Plan
          </Button>
        )}
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && currentPlan ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {currentPlan.name}
                  <Badge variant={currentSubscription.status === 'active' ? 'default' : 'secondary'}>
                    {currentSubscription.status.replace('_', ' ')}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-1 mt-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold">${currentPlan.price}</span>
                    <span>/ {currentPlan.billingCycle}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Plan Limits</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Products: {checkPlanLimits(currentPlan).productsUsed}/{currentPlan.limits?.maxProducts || 'Unlimited'}</p>
                  <p>Discount Codes: {checkPlanLimits(currentPlan).discountCodesUsed}/{currentPlan.limits?.maxDiscountCodes || 'Unlimited'}</p>
                  <p>Loyalty Program: {currentPlan.limits?.loyaltyProgramAccess ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Payment Method</h4>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-4 h-4" />
                  {currentSubscription.paymentMethod === 'paypal' ? 'PayPal' : 'Manual Payment'}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <div className="space-y-1">
                  {currentPlan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <h3 className="text-lg font-medium mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-4">Choose a subscription plan to start using premium features</p>
              <Button onClick={() => setIsUpgradeOpen(true)}>
                Choose a Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          return (
            <Card key={plan.id} className={isCurrentPlan ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.name}
                      {isCurrentPlan && <Badge variant="default">Current</Badge>}
                    </CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${plan.price}</span>
                        <span>/ {plan.billingCycle}</span>
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Plan Limits</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Max Products: {plan.limits?.maxProducts || 'Unlimited'}</p>
                      <p>Max Discount Codes: {plan.limits?.maxDiscountCodes || 'Unlimited'}</p>
                      <p>Loyalty Program: {plan.limits?.loyaltyProgramAccess ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Features</p>
                    <div className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {!isCurrentPlan && (
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => {
                        setSelectedPlan(plan.id);
                        setIsUpgradeOpen(true);
                      }}
                    >
                      {currentPlan ? 'Upgrade to This Plan' : 'Choose This Plan'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upgrade/Subscribe Dialog */}
      <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentPlan ? 'Upgrade Plan' : 'Subscribe to Plan'}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan && plans.find(p => p.id === selectedPlan)?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(value: 'paypal' | 'manual_payment') => setPaymentMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="manual_payment">Manual Payment (Bank Transfer)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === 'manual_payment' && (
              <div className="space-y-2">
                <Label htmlFor="proof">Upload Payment Proof</Label>
                <Input
                  id="proof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  required
                />
                {paymentProof && (
                  <div className="mt-2">
                    <img
                      src={paymentProof}
                      alt="Payment proof"
                      className="max-w-full h-32 object-contain border rounded"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot or photo of your bank transfer receipt
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUpgradeOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={paymentMethod === 'paypal' ? handlePayPalPayment : handleManualPayment}
                disabled={isProcessing || (paymentMethod === 'manual_payment' && !paymentProof)}
              >
                {isProcessing ? 'Processing...' : 
                 paymentMethod === 'paypal' ? 'Pay with PayPal' : 'Submit Payment'
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorSubscriptionManager;