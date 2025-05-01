import { ICustomerModel } from "../../../frameworks/database/mongoDB/models/customer.model";
import { ICustomerEntity } from "../../models/customer.entity";

export interface ICustomerRepository {
    save(data: Partial<ICustomerEntity>): Promise<ICustomerModel>;
    findByEmail(email: string): Promise<ICustomerEntity | null>;
    findById(id: any): Promise<ICustomerEntity | null>;
    updateByEmail(
        email: string,
        updates: Partial<ICustomerEntity>
    ): Promise<ICustomerEntity | null>;
    find(
        filter: any,
        skip: number,
        limit: number
    ): Promise<{users: ICustomerEntity[] | []; total: number}>
    findByIdAndUpdateStatus(id: string): Promise<void>
    findByIdAndUpdate(id:string, updates: Partial<ICustomerEntity>): Promise<ICustomerEntity | null>
    findByIdAndDelete(userId: string): Promise<void>
    findCustomerGrowthData(groupStage: any, filter: string): Promise<{name: string; customers: number}[]>;
    findByIdsNotIn(ids: string[]): Promise<{ _id: string; name: string }[]>;
}