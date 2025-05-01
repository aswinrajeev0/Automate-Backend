import { injectable } from "tsyringe";
import { CustomerModel, ICustomerModel } from "../../../frameworks/database/mongoDB/models/customer.model";
import { ICustomerEntity } from "../../../entities/models/customer.entity";
import { ICustomerRepository } from "../../../entities/repositoryInterfaces/customer/customer-repository.interface";

@injectable()
export class CustomerRepository implements ICustomerRepository {
    async save(data: Partial<ICustomerEntity>): Promise<ICustomerModel> {
        const customer = await CustomerModel.create(data);
        return customer;
    };

    async findById(id: any): Promise<ICustomerEntity | null> {
        const customer = await CustomerModel.findById(id);
        if (!customer) return null;
        return customer
    };

    async findByEmail(email: string): Promise<ICustomerEntity | null> {
        const customer = await CustomerModel.findOne({ email });
        if (!customer) return null;
        return customer;
    };

    async updateByEmail(email: string, updates: Partial<ICustomerEntity>): Promise<ICustomerEntity | null> {
        const customer = await CustomerModel.findOneAndUpdate(
            { email },
            { $set: updates },
            { new: true }
        );
        if (!customer) return null;
        return customer
    }

    async find(filter: any, skip: number, limit: number): Promise<{ users: ICustomerEntity[] | []; total: number; }> {
        const users = await CustomerModel.find({ isAdmin: false, ...filter }).skip(skip).limit(limit);
        return { users, total: users.length }
    }

    async findByIdAndUpdateStatus(id: string): Promise<void> {
        const customer = await CustomerModel.findById(id);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const updatedStatus = !customer.isBlocked;

        await CustomerModel.findByIdAndUpdate(id, { $set: { isBlocked: updatedStatus } });
    }

    async findByIdAndUpdate(id: string, updates: Partial<ICustomerEntity>): Promise<ICustomerEntity | null> {
        const customer = await CustomerModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
        return customer
    }

    async findByIdAndDelete(userId: string): Promise<void> {
        await CustomerModel.findByIdAndDelete(userId)
    }

    async findCustomerGrowthData(groupStage: any, filter: string): Promise<{ name: string; customers: number; }[]> {
        const growthData = await CustomerModel.aggregate([
            { $group: groupStage },
            {
                $sort: {
                    "_id.year": 1,
                    ...(filter !== 'yearly' && { "_id.month": 1 }),
                }
            }
        ]);

        const formatted = growthData.map(item => ({
            name: filter === 'yearly'
                ? `${item._id.year}`
                : `${item._id.month}/${item._id.year}`,
            customers: item.count as number
        }));
        
        return formatted
    }

    async findByIdsNotIn(ids: string[]): Promise<{ _id: string; name: string; }[]> {
        return await CustomerModel.find({ _id: { $nin: ids } }).select("_id name");
    }
}