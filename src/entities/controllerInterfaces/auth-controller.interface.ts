import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    generateToken(req: Request, res: Response, next: NextFunction): Promise<void>;
}