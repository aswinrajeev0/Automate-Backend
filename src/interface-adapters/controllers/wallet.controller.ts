import { inject, injectable } from "tsyringe";
import { IWalletController } from "../../entities/controllerInterfaces/wallet.controller.interface";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { IWalletUseCase } from "../../entities/useCaseInterfaces/wallet/wallet.usecase.interface";

@injectable()
export class WalletController implements IWalletController {
    constructor(
        @inject("ITransactionRepository") private _transactionRepo: ITransactionRepository,
        @inject("IWalletUseCase") private _walletUseCase: IWalletUseCase
    ) { }

    async getWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            const pageNumber = Number(req.query.page) || 1;
            const limitNumber = Number(req.query.limit) || 10;
            const skip = (pageNumber - 1) * limitNumber;

            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const { wallet, transactions, totalTransactions } = await this._walletUseCase.getWallet(customerId, skip, limitNumber)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                wallet,
                transactions,
                totalTransactions: totalTransactions
            })

        } catch (error) {
            next(error)
        }
    }

    async addMoney(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            const amount = req.body.amount;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const transactions = await this._walletUseCase.addMoney(customerId, amount)

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.MONEY_ADDED,
                transactions
            })

        } catch (error) {
            next(error)
        }
    }

    async walletPurchase(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            const amount = req.body.amount;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const transactions = await this._walletUseCase.walletPurchase(customerId, amount)
            
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.MONEY_ADDED,
                transactions
            })

        } catch (error) {
            next(error)
        }
    }
}