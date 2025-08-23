import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle, XCircle, Pause, CreditCard, Upload, Calendar } from 'lucide-react';
import { vendorStorage, subscriptionPlanStorage, vendorSubscriptionStorage, type Vendor, type VendorSubscription } from '../lib/storage';
import { useToast } from '../hooks/use-toast';

const VendorManager: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(vendorStorage.getAll());
  const [subscriptions, setSubscriptions] = useState<VendorSubscription[]>(vendorSubscriptionStorage.getAll());
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    planId: '',
    paymentMethod: 'paypal' as 'paypal' | 'proof_of_payment',
    paymentProof: ''
  });
  const { toast } = useToast();

  const plans = subscriptionPlanStorage.getAll();

  const handleStatusChange = (vendorId: string, newStatus: Vendor['status']) => {
    const updatedVendor = vendorStorage.update(vendorId, { status: newStatus });
    if (updatedVendor) {
      setVendors(vendors.map(v => v.id === vendorId ? updatedVendor : v));
      toast({
        title: "Status updated",
        description: `Vendor status changed to ${newStatus}`,
      });
    }
  };

  const handleCreateSubscription = () => {
    if (!selectedVendor || !subscriptionForm.planId) return;

    const plan = plans.find(p => p.id === subscriptionForm.planId);
    if (!plan) return;

    // Check if vendor already has a subscription
    const existingSub = subscriptions.find(s => s.vendorId === selectedVendor.id);
    if (existingSub) {
      toast({
        title: "Subscription exists",
        description: "This vendor already has a subscription. Please manage the existing one.",
        variant: "destructive"
      });
      return;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.billingCycle === 'yearly' ? 12 : 1));

    const newSubscription = vendorSubscriptionStorage.create({
      vendorId: selectedVendor.id,
      planId: plan.id,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      paymentMethod: subscriptionForm.paymentMethod,
      paymentProof: subscriptionForm.paymentProof,
      autoRenew: true
    });

    // Update vendor subscription reference
    vendorStorage.update(selectedVendor.id, { subscriptionId: newSubscription.id });

    setSubscriptions([...subscriptions, newSubscription]);
    setVendors(vendors.map(v => v.id === selectedVendor.id ? { ...v, subscriptionId: newSubscription.id } : v));
    setIsSubscriptionOpen(false);
    setSelectedVendor(null);
    setSubscriptionForm({ planId: '', paymentMethod: 'paypal', paymentProof: '' });
    
    toast({
      title: "Subscription created",
      description: `${plan.name} subscription created for ${selectedVendor.storeName}`,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSubscriptionForm({
          ...subscriptionForm,
          paymentProof: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getSubscriptionStatus = (vendorId: string) => {
    return subscriptions.find(s => s.vendorId === vendorId);
  };

  const getPlanName = (planId: string) => {
    return plans.find(p => p.id === planId)?.name || 'Unknown Plan';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-muted-foreground">Manage vendor accounts and subscriptions</p>
        </div>
      </div>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Accounts</CardTitle>
              <CardDescription>
                Approve, reject, or suspend vendor accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendors.map((vendor) => {
                    const subscription = getSubscriptionStatus(vendor.id);
                    return (
                      <TableRow key={vendor.id}>
                        <TableCell className="font-medium">{vendor.storeName}</TableCell>
                        <TableCell>{vendor.email}</TableCell>
                        <TableCell>
                          <Badge variant={
                            vendor.status === 'approved' ? 'default' :
                            vendor.status === 'pending' ? 'secondary' :
                            vendor.status === 'suspended' ? 'destructive' : 'outline'
                          }>
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {subscription ? (
                            <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                              {getPlanName(subscription.planId)} - {subscription.status}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">No subscription</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(vendor.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {vendor.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(vendor.id, 'approved')}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleStatusChange(vendor.id, 'rejected')}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {vendor.status === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(vendor.id, 'suspended')}
                              >
                                <Pause className="w-4 h-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                            {vendor.status === 'suspended' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(vendor.id, 'approved')}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Reactivate
                              </Button>
                            )}
                            {!subscription && vendor.status === 'approved' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedVendor(vendor);
                                  setIsSubscriptionOpen(true);
                                }}
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                Add Subscription
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>
                Monitor vendor subscriptions and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => {
                    const vendor = vendors.find(v => v.id === subscription.vendorId);
                    const plan = plans.find(p => p.id === subscription.planId);
                    return (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">
                          {vendor?.storeName || 'Unknown Vendor'}
                        </TableCell>
                        <TableCell>{plan?.name || 'Unknown Plan'}</TableCell>
                        <TableCell>
                          <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                            {subscription.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {subscription.paymentMethod === 'paypal' ? (
                              <CreditCard className="w-4 h-4" />
                            ) : (
                              <Upload className="w-4 h-4" />
                            )}
                            {subscription.paymentMethod}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.startDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Subscription Dialog */}
      <Dialog open={isSubscriptionOpen} onOpenChange={setIsSubscriptionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Subscription</DialogTitle>
            <DialogDescription>
              Create a subscription for {selectedVendor?.storeName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription Plan</Label>
              <Select value={subscriptionForm.planId} onValueChange={(value) => setSubscriptionForm({...subscriptionForm, planId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/{plan.billingCycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Payment Method</Label>
              <Select value={subscriptionForm.paymentMethod} onValueChange={(value: 'paypal' | 'proof_of_payment') => setSubscriptionForm({...subscriptionForm, paymentMethod: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="proof_of_payment">Proof of Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {subscriptionForm.paymentMethod === 'proof_of_payment' && (
              <div className="space-y-2">
                <Label htmlFor="proof">Payment Proof</Label>
                <Input
                  id="proof"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {subscriptionForm.paymentProof && (
                  <div className="mt-2">
                    <img
                      src={subscriptionForm.paymentProof}
                      alt="Payment proof"
                      className="max-w-full h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSubscriptionOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSubscription}>
                Create Subscription
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorManager;