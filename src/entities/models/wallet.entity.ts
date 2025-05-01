export interface IWalletEntity {
    id?: string;
    customerId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    walletId: string;
}