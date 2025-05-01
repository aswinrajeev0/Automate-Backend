import { ICustomerEntity } from "./customer.entity";

export interface PaginatedCustomers {
    users: ICustomerEntity[] | [],
    total: number
}