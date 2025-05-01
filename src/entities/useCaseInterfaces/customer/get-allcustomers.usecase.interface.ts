import { PaginatedCustomers } from "../../models/paginated-customer.entity";

export interface IGetAllCustomersUseCase {
    execute(
        pageNumber: number,
        pageSize: number,
        searchTerm: string
    ): Promise<PaginatedCustomers>
}