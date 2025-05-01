import { inject, injectable } from "tsyringe";
import { IGetCustomerAddressUseCase } from "../../entities/useCaseInterfaces/customer/get-customer-address.usecase.interface";
import { ICustomerEntity } from "../../entities/models/customer.entity";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class GetCustomerAddressUseCase implements IGetCustomerAddressUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(customerId: string | undefined): Promise<Partial<ICustomerEntity>> {
        if(!customerId){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const customer = await this._customerRepo.findById(customerId);
        if(!customer) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return {
            country: customer.country,
            state: customer.state,
            city: customer.city,
            streetAddress: customer.streetAddress,
            buildingNo: customer.buildingNo
        }
    }
}