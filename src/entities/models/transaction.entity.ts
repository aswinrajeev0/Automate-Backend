export interface ITransactionEntity {
    id?: string;
    wallet: string;
    type: "debit" | "credit";
    amount: number;
    reference: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    transactionId: string
}