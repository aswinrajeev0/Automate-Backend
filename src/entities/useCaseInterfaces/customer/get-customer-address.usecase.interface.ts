import { ICustomerEntity } from "../../models/customer.entity";

export interface IGetCustomerAddressUseCase {
    execute(customerId: string | undefined): Promise<Partial<ICustomerEntity>>
}