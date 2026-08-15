import { PaymentMethod, PaymentStatus, TransactionType } from '../types';

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  customer: CustomerInfo;
  paymentMethod: PaymentMethod;
  transactionType: TransactionType;
  metadata?: Record<string, unknown>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  redirectUrl?: string;
  qrCodeUrl?: string;
  bankAccountNumber?: string;
  message: string;
  isMockGateway: true;
  afifahGatewayReady: boolean;
}

/**
 * PaymentService Abstraction Layer
 * This interface and class structure allows seamless integration with
 * Afifah's upcoming custom payment gateway implementation.
 */
export interface IPaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  checkPaymentStatus(orderId: string): Promise<PaymentStatus>;
  refundPayment(orderId: string, amount?: number): Promise<boolean>;
}

export class MockPaymentService implements IPaymentService {
  private gatewayName = 'ADMS Payment Service (Afifah Gateway Ready Abstraction)';

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Simulate network delay for payment processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockTxId = `TX-AFIFAH-${Date.now().toString().slice(-6)}`;

    // Handle payment method specific response format
    let qrCodeUrl: string | undefined;
    let bankAccountNumber: string | undefined;

    if (request.paymentMethod === 'qris') {
      qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ADMS-QRIS-${request.orderId}-${request.amount}`;
    } else if (request.paymentMethod.startsWith('bank_transfer')) {
      bankAccountNumber = '880123984012 (BCA a/n ADMS Armada Digital)';
    }

    return {
      success: true,
      transactionId: mockTxId,
      orderId: request.orderId,
      amount: request.amount,
      status: 'paid', // Simulating successful instant payment in demo mode
      paymentMethod: request.paymentMethod,
      qrCodeUrl,
      bankAccountNumber,
      message: 'Pembayaran berhasil diproses melalui Mock Payment Abstraction.',
      isMockGateway: true,
      afifahGatewayReady: true,
    };
  }

  async checkPaymentStatus(orderId: string): Promise<PaymentStatus> {
    console.log(`[${this.gatewayName}] Checking status for order ${orderId}`);
    return 'paid';
  }

  async refundPayment(orderId: string, amount?: number): Promise<boolean> {
    console.log(`[${this.gatewayName}] Processing refund for order ${orderId}, amount: ${amount}`);
    return true;
  }
}

// Global Singleton Export
export const paymentService: IPaymentService = new MockPaymentService();
