import { injectable, inject } from "tsyringe";
import { IDeleteCustomerUseCase } from "../../entities/useCaseInterfaces/customer/delete-customer.usecase.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class DeleteCustomerUseCase implements IDeleteCustomerUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(userId: string | undefined): Promise<void> {
        if(!userId) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        await this._customerRepo.findByIdAndDelete(userId);
    }
}