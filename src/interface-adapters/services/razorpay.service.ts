import Razorpay from "razorpay";
import { config } from "../../shared/config";
import { IRazorpayService, TPaymentData } from "../../entities/serviceInterfaces.ts/razorpay-service.interface";
import { injectable } from "tsyringe";
import { Orders } from "razorpay/dist/types/orders";
import * as crypto from "crypto";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

const razorpay = new Razorpay({
    key_id: config.razorpay.KEY_ID as string,
    key_secret: config.razorpay.KEY_SECRET as string,
})

@injectable()
export class RazorpayService implements IRazorpayService {
    async createOrder(amount: number, currency: string): Promise<Orders.RazorpayOrder> {
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: `reciept_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options)
        console.log(order)
        return order
    }

    verifyPayment(paymentData: TPaymentData): boolean {
        const { order_id, payment_id, razorpay_signature } = paymentData;
        const hmac = crypto.createHmac("sha256", config.razorpay.KEY_SECRET as string);
        hmac.update(`${order_id}|${payment_id}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpay_signature) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_SIGNATURE, 
                HTTP_STATUS.BAD_REQUEST
            );
        }

        return true;
    }
}