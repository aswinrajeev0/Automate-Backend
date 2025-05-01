import { ICustomerEntity } from "../../models/customer.entity";

export interface IEditCustomerAddressUseCase {
    execute(customerId: string | undefined,data: Partial<ICustomerEntity>): Promise<Partial<ICustomerEntity>>
}