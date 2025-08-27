import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Plus, Edit, Trash2, DollarSign, Package, Gift, Star, CreditCard } from 'lucide-react';
import { subscriptionPlanStorage, vendorSubscriptionStorage, type SubscriptionPlan } from '../lib/storage';
import { useToast } from '../hooks/use-toast';

const SubscriptionPlanManager: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(subscriptionPlanStorage.getAll());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly',
    trialPeriod: '',
    features: '',
    maxProducts: '',
    maxDiscountCodes: '',
    loyaltyProgramAccess: false
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      billingCycle: 'monthly',
      trialPeriod: '',
      features: '',
      maxProducts: '',
      maxDiscountCodes: '',
      loyaltyProgramAccess: false
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.price || !formData.maxProducts || !formData.maxDiscountCodes) return;

    const newPlan = subscriptionPlanStorage.create({
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      trialPeriod: parseInt(formData.trialPeriod) || 0,
      features: formData.features.split('\n').filter(f => f.trim()),
      limits: {
        maxProducts: parseInt(formData.maxProducts),
        maxDiscountCodes: parseInt(formData.maxDiscountCodes),
        loyaltyProgramAccess: formData.loyaltyProgramAccess,
      },
    });

    setPlans([...plans, newPlan]);
    setIsCreateOpen(false);
    resetForm();
    toast({
      title: "Plan created",
      description: `${newPlan.name} has been created successfully.`,
    });
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      billingCycle: plan.billingCycle,
      trialPeriod: plan.trialPeriod.toString(),
      features: plan.features.join('\n'),
      maxProducts: plan.limits.maxProducts.toString(),
      maxDiscountCodes: plan.limits.maxDiscountCodes.toString(),
      loyaltyProgramAccess: plan.limits.loyaltyProgramAccess
    });
  };

  const handleUpdate = () => {
    if (!editingPlan || !formData.name || !formData.price || !formData.maxProducts || !formData.maxDiscountCodes) return;

    const updatedPlan = subscriptionPlanStorage.update(editingPlan.id, {
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      trialPeriod: parseInt(formData.trialPeriod) || 0,
      features: formData.features.split('\n').filter(f => f.trim()),
      limits: {
        maxProducts: parseInt(formData.maxProducts),
        maxDiscountCodes: parseInt(formData.maxDiscountCodes),
        loyaltyProgramAccess: formData.loyaltyProgramAccess,
      },
    });

    if (updatedPlan) {
      setPlans(plans.map(p => p.id === updatedPlan.id ? updatedPlan : p));
    }

    setEditingPlan(null);
    resetForm();
    toast({
      title: "Plan updated",
      description: `${updatedPlan?.name} has been updated successfully.`,
    });
  };

  const handleDelete = (planId: string) => {
    const subscriptions = vendorSubscriptionStorage.getAll();
    const hasActiveSubscriptions = subscriptions.some(s => s.planId === planId && s.status === 'active');
    
    if (hasActiveSubscriptions) {
      toast({
        title: "Cannot delete plan",
        description: "This plan has active subscriptions. Please migrate or cancel them first.",
        variant: "destructive",
      });
      return;
    }

    if (subscriptionPlanStorage.delete(planId)) {
      setPlans(plans.filter(p => p.id !== planId));
      toast({
        title: "Plan deleted",
        description: "The subscription plan has been deleted successfully.",
      });
    }
  };

  const getSubscriberCount = (planId: string) => {
    const subscriptions = vendorSubscriptionStorage.getAll();
    return subscriptions.filter(s => s.planId === planId && s.status === 'active').length;
  };

  const PlanForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Basic Plan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="29.99"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billing">Billing Cycle</Label>
          <Select value={formData.billingCycle} onValueChange={(value: 'monthly' | 'yearly') => setFormData({...formData, billingCycle: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="trial">Trial Period (days)</Label>
          <Input
            id="trial"
            type="number"
            value={formData.trialPeriod}
            onChange={(e) => setFormData({...formData, trialPeriod: e.target.value})}
            placeholder="7"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxProducts">Max Products</Label>
          <Input
            id="maxProducts"
            type="number"
            value={formData.maxProducts}
            onChange={(e) => setFormData({...formData, maxProducts: e.target.value})}
            placeholder="50"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxDiscountCodes">Max Discount Codes</Label>
          <Input
            id="maxDiscountCodes"
            type="number"
            value={formData.maxDiscountCodes}
            onChange={(e) => setFormData({...formData, maxDiscountCodes: e.target.value})}
            placeholder="10"
            required
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="loyalty"
          checked={formData.loyaltyProgramAccess}
          onCheckedChange={(checked) => setFormData({...formData, loyaltyProgramAccess: checked})}
        />
        <Label htmlFor="loyalty">Loyalty Program Access</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          value={formData.features}
          onChange={(e) => setFormData({...formData, features: e.target.value})}
          placeholder="Custom branding&#10;Order management&#10;Analytics dashboard"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            editingPlan ? setEditingPlan(null) : setIsCreateOpen(false);
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button onClick={editingPlan ? handleUpdate : handleCreate}>
          {editingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Subscription Plans</h2>
          <p className="text-muted-foreground">Manage subscription plans with vendor limits and payment options</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Subscription Plan</DialogTitle>
              <DialogDescription>
                Create a new subscription plan with vendor limits and features
              </DialogDescription>
            </DialogHeader>
            <PlanForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    <Badge variant="secondary">
                      {getSubscriberCount(plan.id)} subscribers
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">${plan.price}</span>
                      <span>/ {plan.billingCycle}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Trial Period</p>
                  <p className="text-sm text-muted-foreground">{plan.trialPeriod} days</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Plan Limits</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Max Products: {plan.limits.maxProducts}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Gift className="w-4 h-4" />
                      <span>Max Discount Codes: {plan.limits.maxDiscountCodes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>Loyalty Program: {plan.limits.loyaltyProgramAccess ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Features</p>
                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span>PayPal & Manual Payment</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subscription Plan</DialogTitle>
            <DialogDescription>
              Update the subscription plan details and limits
            </DialogDescription>
          </DialogHeader>
          <PlanForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlanManager;