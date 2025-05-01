import { inject, injectable } from "tsyringe";
import { IEditCustomerUseCase } from "../../entities/useCaseInterfaces/customer/edit-customer.interface.usecase";
import { ICustomerEntity } from "../../entities/models/customer.entity";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class EditCustomerUseCase implements IEditCustomerUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(data: Partial<ICustomerEntity>): Promise<Partial<ICustomerEntity>> {
        const {name, phone, image, id, bio} = data;
        const updates = {
            name,
            phone,
            image,
            bio
        }
        const user = await this._customerRepo.findByIdAndUpdate(id as string, updates)
        if(!user){
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        return user
    }
}