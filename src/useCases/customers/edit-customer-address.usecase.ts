import { inject, injectable } from "tsyringe";
import { IEditCustomerAddressUseCase } from "../../entities/useCaseInterfaces/customer/edit-customer-address.usecase.interface";
import { ICustomerEntity } from "../../entities/models/customer.entity";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class EditCustomerAddressUseCase implements IEditCustomerAddressUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(customerId: string | undefined, data: Partial<ICustomerEntity>): Promise<Partial<ICustomerEntity>> {
        if(!customerId){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const {country, state, city, streetAddress, buildingNo} = data

        const updates = {
            country,
            state,
            city,
            streetAddress,
            buildingNo
        }

        const customer = await this._customerRepo.findByIdAndUpdate(customerId, updates)

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