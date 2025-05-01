import { inject, injectable } from "tsyringe";
import { PaginatedCustomers } from "../../entities/models/paginated-customer.entity";
import { IGetAllCustomersUseCase } from "../../entities/useCaseInterfaces/customer/get-allcustomers.usecase.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetAllCustomersUseCase implements IGetAllCustomersUseCase {

    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(pageNumber: number, pageSize: number, searchTerm: string): Promise<PaginatedCustomers> {
        let filter:any = {};

        if(searchTerm){
            filter.$or = [
                {name: {$regex: searchTerm, $options: "i"}},
                {email: {$regex: searchTerm, $options: "i"}}
            ]
        }

        const validPageNumber = Math.max(1, pageNumber || 1);
		const validPageSize = Math.max(1, pageSize || 10);
		const skip = (validPageNumber - 1) * validPageSize;
		const limit = validPageSize;

        const { users, total } = await this._customerRepo.find(
            filter,
            skip,
            limit
        );

        const response: PaginatedCustomers = {
            users,
            total: Math.ceil(total / validPageSize),
        };

        return response;
    }
}