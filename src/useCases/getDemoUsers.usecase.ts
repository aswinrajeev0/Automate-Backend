import { inject, injectable } from "tsyringe";
import { IGetDemoUsersUseCase } from "../entities/useCaseInterfaces/getDemoUsers.usecase.interface";
import { ICustomerModel } from "../frameworks/database/mongoDB/models/customer.model";
import { ICustomerRepository } from "../entities/repositoryInterfaces/customer/customer-repository.interface";

@injectable()
export class GetDemoUsersUseCase implements IGetDemoUsersUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(limit: number, skip: number, searchQuery: string): Promise<{users: ICustomerModel[], > {
        // const filter = {

        // }
        const {users, total} = await this._customerRepo.find({},skip, limit);

        return {users, total}
    }
}