import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Shield, Users, CreditCard, Settings, LogOut, DollarSign, TrendingUp } from 'lucide-react';
import SubscriptionPlanManager from '../components/SubscriptionPlanManager';
import VendorManager from '../components/VendorManager';
import { vendorStorage, orderStorage, subscriptionPlanStorage, vendorSubscriptionStorage } from '../lib/storage';

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('overview');

  if (!admin) {
    return <Navigate to="/admin/auth" replace />;
  }

  const vendors = vendorStorage.getAll();
  const subscriptions = vendorSubscriptionStorage.getAll();
  const plans = subscriptionPlanStorage.getAll();
  const allOrders = vendors.flatMap(vendor => orderStorage.getAll(vendor.id));

  const stats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'approved').length,
    pendingVendors: vendors.filter(v => v.status === 'pending').length,
    totalRevenue: subscriptions.reduce((sum, sub) => {
      const plan = plans.find(p => p.id === sub.planId);
      return sum + (plan?.price || 0);
    }, 0),
    totalOrders: allOrders.length,
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Food SaaS Platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{admin.role}</Badge>
            <span className="text-sm font-medium">{admin.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalVendors}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeVendors} active, {stats.pendingVendors} pending
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From {stats.activeSubscriptions} subscriptions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all vendors
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{plans.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Subscription plans available
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Vendor Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vendors.slice(-5).reverse().map((vendor) => (
                      <div key={vendor.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{vendor.storeName}</p>
                          <p className="text-sm text-muted-foreground">{vendor.email}</p>
                        </div>
                        <Badge variant={
                          vendor.status === 'approved' ? 'default' :
                          vendor.status === 'pending' ? 'secondary' :
                          vendor.status === 'suspended' ? 'destructive' : 'outline'
                        }>
                          {vendor.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {plans.map((plan) => {
                      const planSubs = subscriptions.filter(s => s.planId === plan.id && s.status === 'active');
                      return (
                        <div key={plan.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${plan.price}/{plan.billingCycle}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {planSubs.length} subscribers
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vendors">
            <VendorManager />
          </TabsContent>

          <TabsContent value="subscriptions">
            <SubscriptionPlanManager />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Platform Name</label>
                    <p className="text-sm text-muted-foreground">Food SaaS Platform</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Version</label>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Additional platform settings and configurations can be added here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;