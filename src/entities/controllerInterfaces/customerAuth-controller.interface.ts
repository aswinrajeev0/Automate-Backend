import { Request, Response } from "express";

export interface ICustomerAuthController {
    customerSignUp(req: Request, res: Response): Promise<void>;
    sendOtp(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
}