import { IWalletModel } from "../../../frameworks/database/mongoDB/models/wallet.model";
import { IWalletEntity } from "../../models/wallet.entity";

export interface IWalletRepository {
    save(data: Partial<IWalletEntity>): Promise<IWalletModel>
    findOne(filter: Partial<IWalletEntity>): Promise<IWalletModel | null>;
    addMoney(customerId: string, amount: number): Promise<IWalletModel | null>;
    deductMoney(customerId: string, amount: number): Promise<IWalletModel | null>;
    refundUpdate(customerId: string, amount: number): Promise<IWalletModel | null>;
}