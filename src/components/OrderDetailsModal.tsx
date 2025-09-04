import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order } from '@/lib/storage';
import { Package, User, Phone, MapPin, CreditCard, Camera } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  showCustomerInfo?: boolean;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  showCustomerInfo = true
}) => {
  const isMobile = useIsMobile();

  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'preparing':
        return 'secondary';
      case 'out_for_delivery':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <Badge variant={getStatusColor(order.status)}>
          {order.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4" />
            Order Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.selectedVariation && (
                    <div className="text-sm text-muted-foreground mt-1">
                      <strong>Variation:</strong> {item.selectedVariation.name}
                    </div>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      <strong>Add-ons:</strong> {item.selectedAddOns.map(addon => addon.name).join(', ')}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between items-center font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="h-4 w-4" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Payment Method</span>
            <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
          </div>
          
          {order.selectedPaymentMethod && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Selected Method</span>
              <span>{order.selectedPaymentMethod}</span>
            </div>
          )}
          
          {order.paymentProof && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Payment Proof:</p>
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-muted-foreground" />
                <img 
                  src={order.paymentProof} 
                  alt="Payment Proof" 
                  className="max-w-32 max-h-32 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(order.paymentProof, '_blank')}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Information */}
      {showCustomerInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{order.customerInfo.name}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.customerInfo.phone}</span>
            </div>
            
            {order.customerInfo.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{order.customerInfo.address}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Order Type</span>
              <span className="capitalize">{order.orderType}</span>
            </div>
            
            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                <p className="text-sm bg-muted p-2 rounded">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Order Details</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8 overflow-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;