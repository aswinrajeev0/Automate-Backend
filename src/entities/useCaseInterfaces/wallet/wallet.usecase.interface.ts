import { ITransactionModel } from "../../../frameworks/database/mongoDB/models/transaction.model";
import { IWalletModel } from "../../../frameworks/database/mongoDB/models/wallet.model";

export interface IWalletUseCase {
    getWallet(customerId: string, skip: number, limit: number): Promise<{wallet: IWalletModel; transactions: ITransactionModel[]; totalTransactions: number}>;
    addMoney(customerId: string, amount: number): Promise<ITransactionModel>;
    walletPurchase(customerId: string, amount: number): Promise<ITransactionModel>;
}