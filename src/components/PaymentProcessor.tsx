import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { paymentGateways, simulatePaymentCallback } from '@/lib/paymentGateways';
import { orderStorage, paymentStorage } from '@/lib/storage';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const PaymentProcessor: React.FC = () => {
  const { gateway } = useParams<{ gateway: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const sessionId = searchParams.get('session_id') || searchParams.get('token');
  const orderId = searchParams.get('order_id');
  const [isProcessing, setIsProcessing] = React.useState(true);
  const [result, setResult] = React.useState<{
    success: boolean;
    message: string;
    transactionId?: string;
  } | null>(null);

  React.useEffect(() => {
    if (!gateway || !orderId || !sessionId) {
      navigate('/');
      return;
    }

    processPayment();
  }, [gateway, orderId, sessionId]);

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get the order to update
      const allOrders = JSON.parse(localStorage.getItem('foodapp_orders') || '[]');
      const order = allOrders.find((o: any) => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }

      // Simulate payment result (80% success rate)
      const paymentSuccess = Math.random() > 0.2;
      const status = paymentSuccess ? 'success' : 'failed';
      
      // Create payment callback result
      const callbackResult = simulatePaymentCallback(
        gateway!,
        sessionId!,
        orderId!,
        status
      );

      if (callbackResult.success) {
        // Create payment record
        const payment = paymentStorage.create({
          orderId: order.id,
          vendorId: order.vendorId,
          customerId: order.customerId,
          amount: order.total,
          currency: 'PHP',
          gateway: gateway as any,
          status: 'completed',
          transactionId: callbackResult.transactionId,
          gatewayResponse: callbackResult.gatewayResponse
        });

        // Update order status
        orderStorage.update(order.id, {
          status: 'confirmed',
          paymentId: payment.id
        }, order.vendorId);

        setResult({
          success: true,
          message: 'Payment completed successfully!',
          transactionId: callbackResult.transactionId
        });

        toast({
          title: 'Payment Successful',
          description: 'Your order has been confirmed.',
        });
      } else {
        // Create failed payment record
        paymentStorage.create({
          orderId: order.id,
          vendorId: order.vendorId,
          customerId: order.customerId,
          amount: order.total,
          currency: 'PHP',
          gateway: gateway as any,
          status: 'failed',
          failureReason: callbackResult.errorMessage,
          gatewayResponse: callbackResult.gatewayResponse
        });

        // Update order status
        orderStorage.update(order.id, {
          status: 'pending_payment'
        }, order.vendorId);

        setResult({
          success: false,
          message: callbackResult.errorMessage || 'Payment failed. Please try again.'
        });

        toast({
          title: 'Payment Failed',
          description: callbackResult.errorMessage || 'Please try again with a different payment method.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred while processing your payment.'
      });

      toast({
        title: 'Payment Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getGatewayDisplayName = (gatewayName: string): string => {
    const gateway = Object.values(paymentGateways).find(g => g.name === gatewayName);
    return gateway?.displayName || gatewayName;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" />
              <h2 className="text-xl font-semibold">Processing Payment</h2>
              <p className="text-muted-foreground">
                Please wait while we process your {getGatewayDisplayName(gateway!)} payment...
              </p>
              <div className="text-sm text-muted-foreground">
                Order ID: {orderId}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {result?.success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className={result?.success ? 'text-green-700' : 'text-red-700'}>
            {result?.success ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{result?.message}</p>
            
            {result?.transactionId && (
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium">Transaction ID</p>
                <p className="text-xs text-muted-foreground font-mono">{result.transactionId}</p>
              </div>
            )}

            <div className="text-sm text-muted-foreground mb-4">
              <p>Payment Method: {getGatewayDisplayName(gateway!)}</p>
              <p>Order ID: {orderId}</p>
            </div>
          </div>

          <div className="space-y-2">
            {result?.success ? (
              <>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/order-confirmation/${orderId}`)}
                >
                  View Order Details
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </>
            ) : (
              <>
                <Button 
                  className="w-full" 
                  onClick={() => navigate(`/order/${orderId}/retry-payment`)}
                >
                  Try Different Payment Method
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessor;