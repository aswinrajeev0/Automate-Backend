import { ICustomerEntity } from "../../models/customer.entity";

export interface IEditCustomerUseCase {
    execute(data: Partial<ICustomerEntity>): Promise<Partial<ICustomerEntity>>
}