import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar';
import { Badge } from '../components/ui/badge';
import { Shield, Users, CreditCard, Settings, LogOut, DollarSign, TrendingUp } from 'lucide-react';
import SubscriptionPlanManager from '../components/SubscriptionPlanManager';
import VendorManager from '../components/VendorManager';
import AdminSidebar from '../components/AdminSidebar';
import IconManager from '../components/IconManager';
import { vendorStorage, orderStorage, subscriptionPlanStorage, vendorSubscriptionStorage } from '../lib/storage';

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdmin();
  const [activeSection, setActiveSection] = useState('overview');

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

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your food delivery platform</p>
            </div>

            {/* Stats Cards */}
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
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    From subscription fees
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
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    Paying customers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>Key metrics and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Vendor Approval Status</span>
                    <div className="flex gap-2">
                      <Badge variant="default">{stats.activeVendors} Approved</Badge>
                      <Badge variant="secondary">{stats.pendingVendors} Pending</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Subscription Plans</span>
                    <Badge variant="outline">{plans.length} Plans</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Platform Revenue</span>
                    <span className="text-sm font-bold">${stats.totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Platform performance and insights</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Advanced analytics coming soon</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed analytics and reporting features will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'vendors':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Vendor Management</h1>
              <p className="text-muted-foreground">Manage vendor accounts and approvals</p>
            </div>
            <VendorManager />
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Customer Management</h1>
              <p className="text-muted-foreground">View and manage customer accounts</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Customer Overview</CardTitle>
                <CardDescription>Customer management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customer management features will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Subscription Plans</h1>
              <p className="text-muted-foreground">Create and manage subscription plans</p>
            </div>
            <SubscriptionPlanManager />
          </div>
        );

      case 'icons':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Icon Library Management</h1>
              <p className="text-muted-foreground">Manage icons available for storefront customization</p>
            </div>
            <IconManager />
          </div>
        );

      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Payment Management</h1>
              <p className="text-muted-foreground">Monitor payments and transactions</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Payment Overview</CardTitle>
                <CardDescription>Transaction monitoring and management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Platform Revenue</span>
                    <span className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Subscriptions</span>
                    <span className="text-lg font-semibold">{stats.activeSubscriptions}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Detailed payment processing and transaction history features coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-muted-foreground">Configure platform settings</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>System-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Platform configuration options will be available here.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Section not found</p>
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AdminSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-card sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-semibold">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Food SaaS Platform</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Welcome, {admin.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;