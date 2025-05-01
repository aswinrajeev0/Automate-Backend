import { Orders } from "razorpay/dist/types/orders";

export type TPaymentData = {
    order_id: string; 
    payment_id: string; 
    razorpay_signature: string
}

export interface IRazorpayService {
    createOrder(amount: number, currency: string): Promise<Orders.RazorpayOrder>;
    verifyPayment(paymentData: TPaymentData): boolean;
}
