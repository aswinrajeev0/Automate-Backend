import { NextFunction, Request, Response } from "express";

export interface IPaymentController {
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): void;
}