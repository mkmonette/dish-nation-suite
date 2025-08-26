import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { emailCampaignStorage, customerStorage, orderStorage, EmailCampaign, Customer } from '@/lib/storage';
import { Plus, Mail, Send, Edit, Trash2, Users, Calendar, Eye, BarChart3 } from 'lucide-react';

interface EmailCampaignManagerProps {
  vendorId: string;
}

const EmailCampaignManager: React.FC<EmailCampaignManagerProps> = ({ vendorId }) => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCampaigns();
    loadCustomers();
  }, [vendorId]);

  const loadCampaigns = () => {
    setCampaigns(emailCampaignStorage.getAll(vendorId));
  };

  const loadCustomers = () => {
    setCustomers(customerStorage.getAll(vendorId));
  };

  const getTargetAudience = (targetType: string): Customer[] => {
    const eligibleCustomers = customers.filter(c => c.marketingPreferences.emailMarketing);
    
    switch (targetType) {
      case 'all':
        return eligibleCustomers;
      case 'loyal':
        return eligibleCustomers.filter(c => (c.loyaltyPoints || 0) >= 100);
      case 'recent':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const orders = orderStorage.getAll(vendorId);
        const recentCustomerIds = orders
          .filter(o => new Date(o.createdAt) >= thirtyDaysAgo)
          .map(o => o.customerId);
        return eligibleCustomers.filter(c => recentCustomerIds.includes(c.id));
      case 'inactive':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const allOrders = orderStorage.getAll(vendorId);
        const activeCustomerIds = allOrders
          .filter(o => new Date(o.createdAt) >= ninetyDaysAgo)
          .map(o => o.customerId);
        return eligibleCustomers.filter(c => !activeCustomerIds.includes(c.id));
      default:
        return eligibleCustomers;
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const targetAudience = formData.get('targetAudience') as string;
    const recipients = getTargetAudience(targetAudience);

    if (recipients.length === 0) {
      toast({
        title: "No recipients",
        description: "No customers found for the selected audience criteria.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    const newCampaign = emailCampaignStorage.create({
      vendorId,
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      targetAudience: targetAudience as any,
      status: 'draft',
      recipients: recipients.map(r => r.id),
    }, vendorId);

    setCampaigns(prev => [...prev, newCampaign]);
    setIsCreateModalOpen(false);
    
    toast({
      title: "Campaign created",
      description: `Email campaign "${newCampaign.name}" has been created with ${recipients.length} recipients.`,
    });
    setIsLoading(false);
  };

  const handleSendCampaign = async (campaign: EmailCampaign) => {
    setIsLoading(true);
    
    // Simulate sending email campaign
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedCampaign = emailCampaignStorage.update(campaign.id, {
      status: 'sent',
      sentAt: new Date().toISOString(),
      openRate: Math.random() * 0.3 + 0.2, // Simulate 20-50% open rate
      clickRate: Math.random() * 0.1 + 0.05, // Simulate 5-15% click rate
    }, vendorId);

    if (updatedCampaign) {
      setCampaigns(prev => prev.map(c => c.id === campaign.id ? updatedCampaign : c));
      toast({
        title: "Campaign sent!",
        description: `Email campaign "${campaign.name}" has been sent to ${campaign.recipients.length} customers.`,
      });
    }
    
    setIsLoading(false);
  };

  const handleDeleteCampaign = (campaignId: string) => {
    emailCampaignStorage.delete(campaignId, vendorId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    toast({
      title: "Campaign deleted",
      description: "Email campaign has been removed.",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'sent': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getAudienceCount = (targetType: string): number => {
    return getTargetAudience(targetType).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">Create and manage email marketing campaigns</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Email Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Summer Sale 2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Select name="targetAudience" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers ({getAudienceCount('all')})</SelectItem>
                      <SelectItem value="loyal">Loyal Customers ({getAudienceCount('loyal')})</SelectItem>
                      <SelectItem value="recent">Recent Customers ({getAudienceCount('recent')})</SelectItem>
                      <SelectItem value="inactive">Inactive Customers ({getAudienceCount('inactive')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="🔥 Don't miss our summer sale!"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your email content here..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Campaigns</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'sent').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.openRate).length > 0 
                ? `${(campaigns.filter(c => c.openRate).reduce((sum, c) => sum + (c.openRate || 0), 0) / campaigns.filter(c => c.openRate).length * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribed Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customers.filter(c => c.marketingPreferences?.emailMarketing).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No email campaigns yet. Create your first campaign to start reaching your customers!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">
                      Target: {campaign.targetAudience} • {campaign.recipients.length} recipients
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                    {campaign.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => handleSendCampaign(campaign)}
                        disabled={isLoading}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Now
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Subject: {campaign.subject}</p>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {campaign.content}
                    </p>
                  </div>
                  
                  {campaign.status === 'sent' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Sent</p>
                        <p className="font-medium">
                          {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Open Rate</p>
                        <p className="font-medium">
                          {campaign.openRate ? `${(campaign.openRate * 100).toFixed(1)}%` : 'N/A'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Click Rate</p>
                        <p className="font-medium">
                          {campaign.clickRate ? `${(campaign.clickRate * 100).toFixed(1)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailCampaignManager;