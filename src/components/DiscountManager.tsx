import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { discountCodeStorage, DiscountCode } from '@/lib/storage';
import { Plus, Percent, DollarSign, Edit, Trash2, Copy } from 'lucide-react';

interface DiscountManagerProps {
  vendorId: string;
}

const DiscountManager: React.FC<DiscountManagerProps> = ({ vendorId }) => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDiscountCodes();
  }, [vendorId]);

  const loadDiscountCodes = () => {
    setDiscountCodes(discountCodeStorage.getAll(vendorId));
  };

  const handleCreateCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const expiresAt = formData.get('expiresAt') as string;
    
    const newCode = discountCodeStorage.create({
      code: formData.get('code') as string,
      type: formData.get('type') as 'percentage' | 'fixed',
      value: parseFloat(formData.get('value') as string),
      minOrderValue: formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : undefined,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : undefined,
      expiresAt: expiresAt || undefined,
      isActive: true,
      vendorId,
    }, vendorId);

    setDiscountCodes(prev => [...prev, newCode]);
    setIsCreateModalOpen(false);
    toast({ title: 'Discount code created!', description: `Code ${newCode.code} is now active.` });
    setIsLoading(false);
  };

  const handleUpdateCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCode) return;
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const expiresAt = formData.get('expiresAt') as string;
    
    const updatedCode = discountCodeStorage.update(editingCode.id, {
      code: formData.get('code') as string,
      type: formData.get('type') as 'percentage' | 'fixed',
      value: parseFloat(formData.get('value') as string),
      minOrderValue: formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : undefined,
      maxUses: formData.get('maxUses') ? parseInt(formData.get('maxUses') as string) : undefined,
      expiresAt: expiresAt || undefined,
    }, vendorId);

    if (updatedCode) {
      setDiscountCodes(prev => prev.map(code => code.id === editingCode.id ? updatedCode : code));
      setEditingCode(null);
      toast({ title: 'Discount code updated!', description: `Code ${updatedCode.code} has been updated.` });
    }
    setIsLoading(false);
  };

  const handleToggleActive = (code: DiscountCode) => {
    const updatedCode = discountCodeStorage.update(code.id, { isActive: !code.isActive }, vendorId);
    if (updatedCode) {
      setDiscountCodes(prev => prev.map(c => c.id === code.id ? updatedCode : c));
      toast({ 
        title: `Code ${updatedCode.isActive ? 'activated' : 'deactivated'}`, 
        description: `${updatedCode.code} is now ${updatedCode.isActive ? 'active' : 'inactive'}.` 
      });
    }
  };

  const handleDeleteCode = (codeId: string) => {
    const success = discountCodeStorage.delete(codeId, vendorId);
    if (success) {
      setDiscountCodes(prev => prev.filter(code => code.id !== codeId));
      toast({ title: 'Discount code deleted', description: 'The discount code has been removed.' });
    }
  };

  const copyCodeToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Code copied!', description: `${code} copied to clipboard.` });
  };

  const isCodeExpired = (code: DiscountCode) => {
    return code.expiresAt && new Date(code.expiresAt) < new Date();
  };

  const isCodeMaxedOut = (code: DiscountCode) => {
    return code.maxUses && code.usedCount >= code.maxUses;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Discount Codes</h2>
          <p className="text-muted-foreground">Create and manage promotional discount codes</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Discount Code</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input 
                  id="code" 
                  name="code" 
                  placeholder="SAVE20"
                  required 
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Discount Type</Label>
                <Select name="type" defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Discount Value</Label>
                <Input 
                  id="value" 
                  name="value" 
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="20"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderValue">Minimum Order Value (Optional)</Label>
                <Input 
                  id="minOrderValue" 
                  name="minOrderValue" 
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUses">Maximum Uses (Optional)</Label>
                <Input 
                  id="maxUses" 
                  name="maxUses" 
                  type="number"
                  min="1"
                  placeholder="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date (Optional)</Label>
                <Input 
                  id="expiresAt" 
                  name="expiresAt" 
                  type="datetime-local"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Code'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {discountCodes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Percent className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No discount codes yet. Create your first promotional code!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {discountCodes.map((code) => (
            <Card key={code.id} className={`${!code.isActive || isCodeExpired(code) || isCodeMaxedOut(code) ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {code.type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                      {code.code}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyCodeToClipboard(code.code)}
                      className="h-6 px-2"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {!code.isActive && <Badge variant="secondary">Inactive</Badge>}
                    {isCodeExpired(code) && <Badge variant="destructive">Expired</Badge>}
                    {isCodeMaxedOut(code) && <Badge variant="destructive">Max Uses Reached</Badge>}
                    {code.isActive && !isCodeExpired(code) && !isCodeMaxedOut(code) && (
                      <Badge variant="default">Active</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>
                  {code.type === 'percentage' ? `${code.value}% off` : `$${code.value} off`}
                  {code.minOrderValue && ` on orders over $${code.minOrderValue}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                  <div className="space-y-1">
                    <p>Used: {code.usedCount}{code.maxUses ? ` / ${code.maxUses}` : ''}</p>
                    {code.expiresAt && (
                      <p>Expires: {new Date(code.expiresAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={code.isActive}
                      onCheckedChange={() => handleToggleActive(code)}
                    />
                    <Label className="text-sm">Active</Label>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCode(code)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCode(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingCode} onOpenChange={() => setEditingCode(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Discount Code</DialogTitle>
          </DialogHeader>
          {editingCode && (
            <form onSubmit={handleUpdateCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Code</Label>
                <Input 
                  id="edit-code" 
                  name="code" 
                  defaultValue={editingCode.code}
                  required 
                  className="uppercase"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Discount Type</Label>
                <Select name="type" defaultValue={editingCode.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-value">Discount Value</Label>
                <Input 
                  id="edit-value" 
                  name="value" 
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingCode.value}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-minOrderValue">Minimum Order Value (Optional)</Label>
                <Input 
                  id="edit-minOrderValue" 
                  name="minOrderValue" 
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingCode.minOrderValue || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maxUses">Maximum Uses (Optional)</Label>
                <Input 
                  id="edit-maxUses" 
                  name="maxUses" 
                  type="number"
                  min="1"
                  defaultValue={editingCode.maxUses || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-expiresAt">Expiry Date (Optional)</Label>
                <Input 
                  id="edit-expiresAt" 
                  name="expiresAt" 
                  type="datetime-local"
                  defaultValue={editingCode.expiresAt ? new Date(editingCode.expiresAt).toISOString().slice(0, 16) : ''}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Code'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountManager;