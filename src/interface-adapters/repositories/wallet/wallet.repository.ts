import { injectable } from "tsyringe";
import { IWalletRepository } from "../../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { IWalletEntity } from "../../../entities/models/wallet.entity";
import { IWalletModel, WalletModel } from "../../../frameworks/database/mongoDB/models/wallet.model";

@injectable()
export class WalletRepository implements IWalletRepository {
    async save(data: Partial<IWalletEntity>): Promise<IWalletModel> {
        const wallet = await WalletModel.create(data);
        return wallet
    }

    async findOne(filter: Partial<IWalletEntity>): Promise<IWalletModel | null> {
        const wallet = await WalletModel.findOne(filter);
        return wallet ? wallet : null
    }

    async addMoney(customerId: string, amount: number): Promise<IWalletModel | null> {
        const wallet = await WalletModel.findOneAndUpdate({customerId}, {$inc: {balance: amount}}, {new: true});
        return wallet;
    }

    async deductMoney(customerId: string, amount: number): Promise<IWalletModel | null> {
        const wallet = await WalletModel.findOneAndUpdate({customerId}, {$inc: {balance: -amount}}, {new: true});
        return wallet;
    }

    async refundUpdate(customerId: string, amount: number): Promise<IWalletModel | null> {
        const wallet = await WalletModel.findOneAndUpdate({customerId}, {$inc: {balance: amount}}, {new: true});
        return wallet;
    }
    
}