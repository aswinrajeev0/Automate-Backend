import { inject, injectable } from "tsyringe";
import { IChangeCustomerPasswordUseCase } from "../../entities/useCaseInterfaces/customer/change-password.usecase.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class ChangeCustomerPasswordUseCase implements IChangeCustomerPasswordUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }
    async execute(customerId: string, data: { oldPassword: string; newPassword: string; confirmPassword: string; }): Promise<void> {
        const { oldPassword, newPassword, confirmPassword } = data;

        const customer = await this._customerRepo.findById(customerId);
        if (!customer) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const passMatch = await this._passwordBcrypt.compare(oldPassword, customer.password)
        if (!passMatch) {
            throw new CustomError(
                ERROR_MESSAGES.WRONG_CURRENT_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if (oldPassword === newPassword) {
            throw new CustomError(
                ERROR_MESSAGES.SAME_CURR_NEW_PASSWORD,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if (newPassword !== confirmPassword) {
            throw new CustomError(
                ERROR_MESSAGES.PASSWORD_NOT_MATCH,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        let hashedPassword = await this._passwordBcrypt.hash(newPassword)

        const updates = {
            password: hashedPassword
        }

        await this._customerRepo.findByIdAndUpdate(customerId, updates)
    }
}