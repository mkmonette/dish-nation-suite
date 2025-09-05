import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { CheckCircle, Store, User, Receipt, CreditCard, FileText, ArrowRight } from 'lucide-react';
import { Order, Vendor } from '@/lib/storage';

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  vendor: Vendor;
  onBackToStore: () => void;
  onViewOrders: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
  vendor,
  onBackToStore,
  onViewOrders
}) => {
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'paid_manual_verification':
        return 'secondary';
      case 'preparing':
        return 'default';
      case 'out_for_delivery':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'paid_manual_verification':
        return 'Payment Under Verification';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const selectedPaymentMethod = vendor.manualPaymentMethods?.find(
    method => method.id === order.selectedPaymentMethod
  );

  const content = (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-green-700">Order Confirmed!</h2>
          <p className="text-muted-foreground">Thank you for your order</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono font-medium">#{order.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Badge>
          </div>
        </div>

        {/* Store Information */}
        <div className="flex items-center gap-3 p-4 border rounded-lg">
          <Store className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{vendor.storeName}</p>
            <p className="text-sm text-muted-foreground">{vendor.description}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Customer Details
          </h3>
          <div className="space-y-2 pl-6">
            <div>
              <span className="text-sm text-muted-foreground">Name: </span>
              <span className="font-medium">{order.customerInfo.name}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Phone: </span>
              <span className="font-medium">{order.customerInfo.phone}</span>
            </div>
            {order.customerInfo.address && (
              <div>
                <span className="text-sm text-muted-foreground">Address: </span>
                <span className="font-medium">{order.customerInfo.address}</span>
              </div>
            )}
            <div>
              <span className="text-sm text-muted-foreground">Order Type: </span>
              <Badge variant="outline" className="capitalize">
                {order.orderType}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Order Items
          </h3>
          <div className="space-y-2 pl-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex-1">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>₱{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Details
          </h3>
          <div className="space-y-2 pl-6">
            <div>
              <span className="text-sm text-muted-foreground">Payment Method: </span>
              <Badge variant="outline" className="capitalize">
                {order.paymentMethod === 'pay_on_delivery' ? 'Pay on Delivery' : 'Manual Payment'}
              </Badge>
            </div>
            
            {order.paymentMethod === 'manual_payment' && selectedPaymentMethod && (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">Payment Option: </span>
                  <span className="font-medium">{selectedPaymentMethod.title}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded border">
                  <p className="text-sm font-medium mb-1">Payment Instructions:</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedPaymentMethod.instructions}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Proof Status: </span>
                  <Badge variant={order.paymentProof ? 'default' : 'secondary'}>
                    {order.paymentProof ? 'Uploaded' : 'Not Uploaded'}
                  </Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Order Notes
            </h3>
            <div className="pl-6">
              <p className="text-sm bg-muted/30 p-3 rounded border">
                {order.notes}
              </p>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {order.paymentMethod === 'manual_payment' && order.status === 'paid_manual_verification' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
            <p className="text-sm text-blue-700">
              Your payment is under verification. The vendor will confirm your payment and begin preparing your order. 
              You'll receive updates on your order status.
            </p>
          </div>
        )}
        
        {order.paymentMethod === 'pay_on_delivery' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">What's Next?</h4>
            <p className="text-sm text-green-700">
              Your order has been placed successfully. The vendor will begin preparing your order. 
              Payment will be collected upon delivery.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-3 ${isMobile ? 'sticky bottom-0 bg-background pt-4 border-t' : ''}`}>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1"
          onClick={onBackToStore}
        >
          <Store className="h-4 w-4 mr-2" />
          Back to Store
        </Button>
        <Button 
          variant="default" 
          size="lg" 
          className="flex-1"
          onClick={onViewOrders}
        >
          <Receipt className="h-4 w-4 mr-2" />
          View My Orders
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh] overflow-hidden">
          <DrawerHeader>
            <DrawerTitle>Order Confirmation</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Confirmation</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationModal;