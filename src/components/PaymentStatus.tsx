import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Payment } from '@/lib/storage';
import { CreditCard, Clock, CheckCircle, XCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface PaymentStatusProps {
  payment: Payment;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ 
  payment, 
  showRetryButton = false, 
  onRetry 
}) => {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      case 'refunded':
        return <RotateCcw className="h-5 w-5 text-blue-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'pending':
      case 'processing':
        return 'secondary';
      case 'cancelled':
        return 'outline';
      case 'refunded':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getGatewayDisplayName = (gateway: string) => {
    switch (gateway) {
      case 'stripe':
        return 'Stripe';
      case 'paypal':
        return 'PayPal';
      case 'paymongo':
        return 'PayMongo';
      case 'lemonsqueezy':
        return 'Lemon Squeezy';
      case 'manual':
        return 'Manual Payment';
      default:
        return gateway;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(payment.status)}
            <Badge variant={getStatusColor(payment.status)}>
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Payment Method</span>
          <span className="text-sm">{getGatewayDisplayName(payment.gateway)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Amount</span>
          <span className="text-sm font-medium">₱{payment.amount.toFixed(2)}</span>
        </div>

        {payment.transactionId && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Transaction ID</span>
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {payment.transactionId}
            </span>
          </div>
        )}

        {payment.failureReason && (
          <div className="space-y-1">
            <span className="text-sm font-medium text-red-600">Failure Reason</span>
            <p className="text-sm text-red-600">{payment.failureReason}</p>
          </div>
        )}

        {payment.refundAmount && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Refund Amount</span>
            <span className="text-sm text-blue-600">₱{payment.refundAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created</span>
          <span>{new Date(payment.createdAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updated</span>
          <span>{new Date(payment.updatedAt).toLocaleString()}</span>
        </div>

        {showRetryButton && payment.status === 'failed' && (
          <div className="pt-2">
            <Button 
              onClick={onRetry} 
              className="w-full"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Different Payment Method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatus;