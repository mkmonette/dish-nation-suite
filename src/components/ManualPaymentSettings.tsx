import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { useVendor } from '@/contexts/VendorContext';
import { ManualPaymentMethod } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface ImageUploadAreaProps {
  onImageSelect: (base64: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({ onImageSelect, currentImage, className }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onImageSelect(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById('qr-upload')?.click()}
    >
      {currentImage ? (
        <div className="space-y-2">
          <img src={currentImage} alt="QR Code" className="max-w-32 max-h-32 mx-auto rounded" />
          <p className="text-sm text-muted-foreground">Click to replace</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop QR code here or click to upload<br />
            PNG/JPG, max 2MB
          </p>
        </div>
      )}
      <input
        id="qr-upload"
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
};

const ManualPaymentSettings: React.FC = () => {
  const { vendor, updateVendor } = useVendor();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ManualPaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructions: '',
    qrCode: '',
    enabled: true
  });

  const paymentMethods = vendor?.manualPaymentMethods || [];
  const isManualPaymentEnabled = vendor?.manualPaymentEnabled || false;

  const resetForm = () => {
    setFormData({
      title: '',
      instructions: '',
      qrCode: '',
      enabled: true
    });
    setEditingMethod(null);
  };

  const handleOpenDialog = (method?: ManualPaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        title: method.title,
        instructions: method.instructions,
        qrCode: method.qrCode || '',
        enabled: method.enabled
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSaveMethod = () => {
    if (!formData.title.trim() || !formData.instructions.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const newMethod: ManualPaymentMethod = {
      id: editingMethod?.id || Date.now().toString(),
      title: formData.title.trim(),
      instructions: formData.instructions.trim(),
      qrCode: formData.qrCode || undefined,
      enabled: formData.enabled
    };

    let updatedMethods;
    if (editingMethod) {
      updatedMethods = paymentMethods.map(method => 
        method.id === editingMethod.id ? newMethod : method
      );
    } else {
      updatedMethods = [...paymentMethods, newMethod];
    }

    updateVendor({
      manualPaymentMethods: updatedMethods
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteMethod = (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
      updateVendor({
        manualPaymentMethods: updatedMethods
      });
    }
  };

  const handleToggleEnabled = (methodId: string) => {
    const updatedMethods = paymentMethods.map(method =>
      method.id === methodId ? { ...method, enabled: !method.enabled } : method
    );
    updateVendor({
      manualPaymentMethods: updatedMethods
    });
  };

  const handleToggleManualPayment = (enabled: boolean) => {
    updateVendor({
      manualPaymentEnabled: enabled
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Payment Configuration</CardTitle>
          <CardDescription>
            Set up manual payment methods for customers to pay through bank transfers, e-wallets, or other offline methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="manual-payment-toggle">Enable Manual Payments</Label>
              <p className="text-sm text-muted-foreground">
                Allow customers to select manual payment options during checkout
              </p>
            </div>
            <Switch
              id="manual-payment-toggle"
              checked={isManualPaymentEnabled}
              onCheckedChange={handleToggleManualPayment}
            />
          </div>

          {isManualPaymentEnabled && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="method-title">Title *</Label>
                        <Input
                          id="method-title"
                          placeholder="e.g., Pay via GCash"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="method-instructions">Instructions *</Label>
                        <Textarea
                          id="method-instructions"
                          placeholder="e.g., Send to GCash 0917XXXXXXX, Name: Juan Dela Cruz"
                          value={formData.instructions}
                          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>QR Code (Optional)</Label>
                        <ImageUploadArea
                          currentImage={formData.qrCode}
                          onImageSelect={(base64) => setFormData({ ...formData, qrCode: base64 })}
                        />
                        {formData.qrCode && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setFormData({ ...formData, qrCode: '' })}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove QR Code
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="method-enabled"
                          checked={formData.enabled}
                          onCheckedChange={(enabled) => setFormData({ ...formData, enabled })}
                        />
                        <Label htmlFor="method-enabled">Enable this payment method</Label>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveMethod} className="flex-1">
                        {editingMethod ? 'Update' : 'Add'} Payment Method
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {paymentMethods.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No payment methods configured yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add your first payment method to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <Card key={method.id}>
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{method.title}</h4>
                              <Badge variant={method.enabled ? 'default' : 'secondary'}>
                                {method.enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {method.instructions}
                            </p>
                            {method.qrCode && (
                              <div className="mt-2">
                                <img 
                                  src={method.qrCode} 
                                  alt="QR Code" 
                                  className="w-16 h-16 rounded border"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Switch
                              checked={method.enabled}
                              onCheckedChange={() => handleToggleEnabled(method.id)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(method)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMethod(method.id)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManualPaymentSettings;