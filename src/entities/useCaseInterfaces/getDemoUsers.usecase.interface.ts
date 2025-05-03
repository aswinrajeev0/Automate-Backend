import { ICustomerModel } from "../../frameworks/database/mongoDB/models/customer.model";

export interface IGetDemoUsersUseCase {
    execute(limit: number, skip: number, searchQuery: string): Promise<ICustomerModel[]>;
}