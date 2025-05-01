import { inject, injectable } from "tsyringe";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IUpdateCustomerStatusUseCase } from "../../entities/useCaseInterfaces/customer/updateCustomer-status.usecase";

@injectable()
export class UpdateCustomerStatusUseCase implements IUpdateCustomerStatusUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
    ){}
    async execute(id: string): Promise<void> {
        await this._customerRepo.findByIdAndUpdateStatus(id)
    }
}