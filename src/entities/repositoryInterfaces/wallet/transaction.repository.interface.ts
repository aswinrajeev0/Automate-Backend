import { ITransactionModel } from "../../../frameworks/database/mongoDB/models/transaction.model";
import { ITransactionEntity } from "../../models/transaction.entity";

export interface ITransactionRepository {
    save(data: Partial<ITransactionEntity>): Promise<ITransactionModel>;
    find(filter: Partial<ITransactionEntity>, skip: number, limit: number): Promise<{transactions: ITransactionModel[]; totalTransactions: number}>;
}