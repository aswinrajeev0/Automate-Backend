import { model, Types } from "mongoose";
import { ITransactionEntity } from "../../../../entities/models/transaction.entity";
import { transactionSchema } from "../schemas/transaction.schema";

export interface ITransactionModel extends Omit<ITransactionEntity, "id" | "wallet"> {
    transactionId: string,
    wallet: Types.ObjectId,
}

export const TransactionModel = model<ITransactionModel>('Transaction', transactionSchema)