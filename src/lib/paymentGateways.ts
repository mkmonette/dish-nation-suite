// Payment gateway simulation utilities
import { Payment } from './storage';

export interface PaymentGatewayConfig {
  name: string;
  displayName: string;
  enabled: boolean;
  testMode: boolean;
  apiKey?: string;
  publicKey?: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail?: string;
  customerName?: string;
  description?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  status: 'completed' | 'failed' | 'cancelled' | 'pending';
  gatewayResponse?: any;
  errorMessage?: string;
}

// Simulate payment gateway responses
export const paymentGateways = {
  stripe: {
    name: 'stripe',
    displayName: 'Stripe (Credit/Debit Card)',
    enabled: true,
    testMode: true,
    
    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure (90% success rate)
      const success = Math.random() > 0.1;
      
      if (success) {
        return {
          success: true,
          transactionId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed',
          gatewayResponse: {
            id: `pi_${Date.now()}`,
            amount: request.amount * 100, // Stripe uses cents
            currency: request.currency.toLowerCase(),
            status: 'succeeded',
            payment_method: 'card_1234'
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          errorMessage: 'Your card was declined. Please try again with a different card.',
          gatewayResponse: {
            error: {
              code: 'card_declined',
              message: 'Your card was declined.'
            }
          }
        };
      }
    },

    async createCheckoutSession(request: PaymentRequest): Promise<{ url: string }> {
      // Simulate creating a checkout session
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const checkoutUrl = `/payment/stripe/checkout?session_id=${sessionId}&order_id=${request.orderId}`;
      return { url: checkoutUrl };
    }
  },

  paypal: {
    name: 'paypal',
    displayName: 'PayPal',
    enabled: true,
    testMode: true,
    
    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const success = Math.random() > 0.05; // 95% success rate
      
      if (success) {
        return {
          success: true,
          transactionId: `PAYID-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'completed',
          gatewayResponse: {
            id: `PAYID-${Date.now()}`,
            state: 'approved',
            amount: {
              total: request.amount.toString(),
              currency: request.currency.toUpperCase()
            }
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          errorMessage: 'PayPal payment failed. Please try again.',
          gatewayResponse: {
            error: 'PAYMENT_DENIED'
          }
        };
      }
    },

    async createCheckoutSession(request: PaymentRequest): Promise<{ url: string }> {
      const sessionId = `EC-${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const checkoutUrl = `/payment/paypal/checkout?token=${sessionId}&order_id=${request.orderId}`;
      return { url: checkoutUrl };
    }
  },

  paymongo: {
    name: 'paymongo',
    displayName: 'PayMongo (GCash, GrabPay, Cards)',
    enabled: true,
    testMode: true,
    
    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const success = Math.random() > 0.08; // 92% success rate
      
      if (success) {
        return {
          success: true,
          transactionId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed',
          gatewayResponse: {
            id: `pi_${Date.now()}`,
            type: 'payment',
            attributes: {
              amount: request.amount * 100,
              currency: request.currency.toLowerCase(),
              status: 'paid'
            }
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          errorMessage: 'Payment failed. Please check your payment method and try again.',
          gatewayResponse: {
            errors: [{
              code: 'payment_failed',
              detail: 'Payment processing failed'
            }]
          }
        };
      }
    },

    async createCheckoutSession(request: PaymentRequest): Promise<{ url: string }> {
      const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const checkoutUrl = `/payment/paymongo/checkout?session_id=${sessionId}&order_id=${request.orderId}`;
      return { url: checkoutUrl };
    }
  },

  lemonsqueezy: {
    name: 'lemonsqueezy',
    displayName: 'Lemon Squeezy',
    enabled: false, // Optional gateway
    testMode: true,
    
    async processPayment(request: PaymentRequest): Promise<PaymentResult> {
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      const success = Math.random() > 0.06; // 94% success rate
      
      if (success) {
        return {
          success: true,
          transactionId: `lemon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'completed',
          gatewayResponse: {
            id: `lemon_${Date.now()}`,
            status: 'paid',
            total: request.amount,
            currency: request.currency
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          errorMessage: 'Lemon Squeezy payment failed. Please try again.',
          gatewayResponse: {
            error: 'payment_failed'
          }
        };
      }
    },

    async createCheckoutSession(request: PaymentRequest): Promise<{ url: string }> {
      const sessionId = `lemon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const checkoutUrl = `/payment/lemonsqueezy/checkout?session_id=${sessionId}&order_id=${request.orderId}`;
      return { url: checkoutUrl };
    }
  }
};

export function getEnabledGateways(): PaymentGatewayConfig[] {
  return Object.values(paymentGateways)
    .filter(gateway => gateway.enabled)
    .map(gateway => ({
      name: gateway.name,
      displayName: gateway.displayName,
      enabled: gateway.enabled,
      testMode: gateway.testMode
    }));
}

export function getGateway(name: string) {
  return paymentGateways[name as keyof typeof paymentGateways];
}

// Simulate payment callback/webhook processing
export function simulatePaymentCallback(
  gateway: string,
  transactionId: string,
  orderId: string,
  status: 'success' | 'failed' | 'cancelled'
): PaymentResult {
  const baseResult = {
    transactionId,
    gatewayResponse: { 
      webhook_id: `wh_${Date.now()}`,
      order_id: orderId,
      gateway
    }
  };

  switch (status) {
    case 'success':
      return {
        ...baseResult,
        success: true,
        status: 'completed'
      };
    case 'failed':
      return {
        ...baseResult,
        success: false,
        status: 'failed',
        errorMessage: 'Payment processing failed'
      };
    case 'cancelled':
      return {
        ...baseResult,
        success: false,
        status: 'cancelled',
        errorMessage: 'Payment was cancelled by user'
      };
    default:
      return {
        ...baseResult,
        success: false,
        status: 'failed',
        errorMessage: 'Unknown payment status'
      };
  }
}