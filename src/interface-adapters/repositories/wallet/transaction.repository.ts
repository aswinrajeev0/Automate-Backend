import { injectable } from "tsyringe";
import { ITransactionRepository } from "../../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { ITransactionEntity } from "../../../entities/models/transaction.entity";
import { ITransactionModel, TransactionModel } from "../../../frameworks/database/mongoDB/models/transaction.model";

@injectable()
export class TransactionRepository implements ITransactionRepository {
    async save(data: Partial<ITransactionEntity>): Promise<ITransactionModel> {
        const transaction = await TransactionModel.create(data);
        return transaction
    }

    async find(filter: Partial<ITransactionEntity>, skip: number, limit: number): Promise<{transactions: ITransactionModel[]; totalTransactions: number}> {
        const transactions = await TransactionModel.find(filter).skip(skip).limit(limit).sort({createdAt: -1})
        const totalTransactions = await TransactionModel.countDocuments(filter);
        return {transactions, totalTransactions}
    }
}