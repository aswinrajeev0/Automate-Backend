import { NextFunction, Request, Response } from "express";

export interface IVerifyOtpController {
	handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}