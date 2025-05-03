import { NextFunction, Request, Response } from "express";

export interface IHealthController {
    healthCheck(req: Request, res: Response): void;
    paginationDemo(req: Request, res: Response, next: NextFunction):Promise<void>;
}