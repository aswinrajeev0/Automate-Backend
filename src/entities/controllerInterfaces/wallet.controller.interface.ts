import { NextFunction, Request, Response } from "express";

export interface IWalletController {
    getWallet(req: Request, res: Response, next: NextFunction): Promise<void>;
    addMoney(req: Request, res: Response, next: NextFunction): Promise<void>;
    walletPurchase(req: Request, res: Response, next: NextFunction): Promise<void>;
}