import { inject, injectable } from "tsyringe";
import { IWalletUseCase } from "../../entities/useCaseInterfaces/wallet/wallet.usecase.interface";
import { ITransactionModel } from "../../frameworks/database/mongoDB/models/transaction.model";
import { IWalletModel } from "../../frameworks/database/mongoDB/models/wallet.model";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class WalletUseCase implements IWalletUseCase {
    constructor(
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("ITransactionRepository") private _transactionRepo: ITransactionRepository
    ) { }

    async getWallet(customerId: string, skip: number, limit: number): Promise<{ wallet: IWalletModel; transactions: ITransactionModel[]; totalTransactions: number }> {
        const wallet = await this._walletRepo.findOne({ customerId });
        if (!wallet) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const {transactions, totalTransactions} = await this._transactionRepo.find({ wallet: wallet._id.toString() }, skip, limit)

        return { wallet, transactions, totalTransactions }
    }

    async addMoney(customerId: string, amount: number): Promise<ITransactionModel> {
        const wallet = await this._walletRepo.addMoney(customerId, amount)
        if (!wallet) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const transactionId = generateUniqueId("txn")

        const transaction = await this._transactionRepo.save({
            amount,
            description: "Deposit",
            type: "credit",
            wallet: wallet._id.toString(),
            transactionId
        })

        return transaction;
    }

    async walletPurchase(customerId: string, amount: number): Promise<ITransactionModel> {
        const wallet = await this._walletRepo.findOne({customerId})
        if (!wallet) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(wallet.balance < amount) {
            throw new CustomError(
                ERROR_MESSAGES.INSUFFICIENT_BALANCE,
                HTTP_STATUS.PAYMENT_REQUIRED
            )
        }
        
        await this._walletRepo.deductMoney(customerId, amount)

        const transactionId = generateUniqueId("txn")

        const transaction = await this._transactionRepo.save({
            amount,
            description: "Purchase",
            type: "debit",
            wallet: wallet._id.toString(),
            transactionId
        })

        return transaction;
    }
}