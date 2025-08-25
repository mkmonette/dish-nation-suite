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
import { notificationTemplateStorage, NotificationTemplate, customerStorage } from '@/lib/storage';
import { Plus, Mail, Bell, Send, Edit, Trash2, Users } from 'lucide-react';

interface NotificationManagerProps {
  vendorId: string;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({ vendorId }) => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [customers, setCustomers] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTemplates();
    loadCustomers();
  }, [vendorId]);

  const loadTemplates = () => {
    setTemplates(notificationTemplateStorage.getAll(vendorId));
  };

  const loadCustomers = () => {
    setCustomers(customerStorage.getAll(vendorId));
  };

  const handleCreateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const newTemplate = notificationTemplateStorage.create({
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as 'email' | 'push',
      vendorId,
    }, vendorId);

    setTemplates(prev => [...prev, newTemplate]);
    setIsCreateModalOpen(false);
    toast({ title: 'Template created!', description: `${newTemplate.name} has been saved.` });
    setIsLoading(false);
  };

  const handleUpdateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTemplate) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const updatedTemplate = notificationTemplateStorage.update(editingTemplate.id, {
      name: formData.get('name') as string,
      subject: formData.get('subject') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as 'email' | 'push',
    }, vendorId);

    if (updatedTemplate) {
      setTemplates(prev => prev.map(template => template.id === editingTemplate.id ? updatedTemplate : template));
      setEditingTemplate(null);
      toast({ title: 'Template updated!', description: `${updatedTemplate.name} has been updated.` });
    }
    setIsLoading(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    const success = notificationTemplateStorage.delete(templateId, vendorId);
    if (success) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      toast({ title: 'Template deleted', description: 'The notification template has been removed.' });
    }
  };

  const handleSendNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    setIsLoading(true);
    
    // Simulate sending notification (in a real app, this would call an API)
    setTimeout(() => {
      setIsSendModalOpen(false);
      setSelectedTemplate(null);
      toast({ 
        title: 'Notifications sent!', 
        description: `${selectedTemplate.name} sent to all customers via ${selectedTemplate.type}.` 
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Notification Center</h2>
          <p className="text-muted-foreground">Create templates and send promotional notifications</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      {/* Customer Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{customers.length}</p>
              <p className="text-muted-foreground">Total customers</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Ready to receive notifications
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Template List */}
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Notification Templates</h3>
        </div>
        
        {templates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notification templates yet. Create your first template!</p>
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {template.type === 'email' ? <Mail className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                      {template.name}
                    </CardTitle>
                    <Badge variant={template.type === 'email' ? 'default' : 'secondary'}>
                      {template.type}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{template.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {template.content}
                </p>
                
                <div className="flex gap-2">
                  <Button
                    variant="order"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setIsSendModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send to All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Notification Template</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTemplate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Weekend Special Promotion"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Notification Type</Label>
              <Select name="type" defaultValue="email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject/Title</Label>
              <Input 
                id="subject" 
                name="subject" 
                placeholder="🍕 Weekend Special - 20% Off All Orders!"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Message Content</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Hey {customer_name}! Don't miss our weekend special - 20% off all orders. Use code WEEKEND20 at checkout. Valid until Sunday!"
                className="min-h-24"
                required 
              />
              <p className="text-xs text-muted-foreground">
                Tip: Use {'{customer_name}'} to personalize messages
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Template'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Template Modal */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Notification Template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <form onSubmit={handleUpdateTemplate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Template Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  defaultValue={editingTemplate.name}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Notification Type</Label>
                <Select name="type" defaultValue={editingTemplate.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subject">Subject/Title</Label>
                <Input 
                  id="edit-subject" 
                  name="subject" 
                  defaultValue={editingTemplate.subject}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Message Content</Label>
                <Textarea 
                  id="edit-content" 
                  name="content" 
                  defaultValue={editingTemplate.content}
                  className="min-h-24"
                  required 
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Template'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Notification Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.subject}</p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{selectedTemplate.content}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Recipients:</span>
                  <Badge variant="secondary">{customers.length} customers</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Notification type:</span>
                  <Badge variant={selectedTemplate.type === 'email' ? 'default' : 'secondary'}>
                    {selectedTemplate.type}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : `Send to ${customers.length} Customers`}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationManager;