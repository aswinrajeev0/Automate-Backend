import { inject, injectable } from "tsyringe";
import { IPaymentController } from "../../entities/controllerInterfaces/payment.controller.interface";
import { IRazorpayService } from "../../entities/serviceInterfaces.ts/razorpay-service.interface";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";

@injectable()
export class PaymentController implements IPaymentController {
    constructor(
        @inject("IRazorpayService") private _razorPayService: IRazorpayService
    ){}

    async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {amount, currency} = req.body;
            const order = await this._razorPayService.createOrder(amount, currency )
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.RAZORPAY_ORDER_CREATED,
                order
            })
        } catch (error) {
            next(error)
        }
    }

    verifyPayment(req: Request, res: Response, next: NextFunction): void {
        try {
            const paymentData = req.body;
            const isValid = this._razorPayService.verifyPayment(paymentData)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PAYMENT_VERIFIED,
                isValid
            })
        } catch (error) {
            next(error)
        }
    }
}