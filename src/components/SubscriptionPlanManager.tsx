import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
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
    maxMenuItems: '',
    maxOrders: ''
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      billingCycle: 'monthly',
      trialPeriod: '',
      features: '',
      maxMenuItems: '',
      maxOrders: ''
    });
  };

  const handleCreate = () => {
    if (!formData.name || !formData.price) return;

    const newPlan = subscriptionPlanStorage.create({
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      trialPeriod: parseInt(formData.trialPeriod) || 0,
      features: formData.features.split('\n').filter(f => f.trim()),
      maxMenuItems: formData.maxMenuItems ? parseInt(formData.maxMenuItems) : undefined,
      maxOrders: formData.maxOrders ? parseInt(formData.maxOrders) : undefined,
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
      maxMenuItems: plan.maxMenuItems?.toString() || '',
      maxOrders: plan.maxOrders?.toString() || ''
    });
  };

  const handleUpdate = () => {
    if (!editingPlan || !formData.name || !formData.price) return;

    const updatedPlan = subscriptionPlanStorage.update(editingPlan.id, {
      name: formData.name,
      price: parseFloat(formData.price),
      billingCycle: formData.billingCycle,
      trialPeriod: parseInt(formData.trialPeriod) || 0,
      features: formData.features.split('\n').filter(f => f.trim()),
      maxMenuItems: formData.maxMenuItems ? parseInt(formData.maxMenuItems) : undefined,
      maxOrders: formData.maxOrders ? parseInt(formData.maxOrders) : undefined,
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
          <Label htmlFor="menuItems">Max Menu Items</Label>
          <Input
            id="menuItems"
            type="number"
            value={formData.maxMenuItems}
            onChange={(e) => setFormData({...formData, maxMenuItems: e.target.value})}
            placeholder="50 (leave empty for unlimited)"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="orders">Max Orders/Month</Label>
          <Input
            id="orders"
            type="number"
            value={formData.maxOrders}
            onChange={(e) => setFormData({...formData, maxOrders: e.target.value})}
            placeholder="100 (leave empty for unlimited)"
          />
        </div>
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
          <p className="text-muted-foreground">Manage subscription plans and pricing</p>
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
                Create a new subscription plan for vendors
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
                
                {(plan.maxMenuItems || plan.maxOrders) && (
                  <div>
                    <p className="text-sm font-medium">Limits</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {plan.maxMenuItems && <p>Max menu items: {plan.maxMenuItems}</p>}
                      {plan.maxOrders && <p>Max orders/month: {plan.maxOrders}</p>}
                    </div>
                  </div>
                )}

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
              Update the subscription plan details
            </DialogDescription>
          </DialogHeader>
          <PlanForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlanManager;