import { inject, injectable } from "tsyringe";
import { ILoginCustomerUseCase } from "../../entities/useCaseInterfaces/auth/login-usecase.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { CustomerLoginDTO } from "../../shared/dtos/auth.dto";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICustomerEntity } from "../../entities/models/customer.entity";

@injectable()
export class LoginCustomerUseCase implements ILoginCustomerUseCase {
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }

    async execute(user: CustomerLoginDTO): Promise<Partial<ICustomerEntity>> {
        try {
            
            const customer = await this._customerRepo.findByEmail(user.email)
            if (!customer) {
                throw new CustomError(
                    ERROR_MESSAGES.USER_NOT_FOUND,
                    HTTP_STATUS.NOT_FOUND
                )
            }
            
            if (customer.isBlocked) {
                throw new CustomError(
                    ERROR_MESSAGES.BLOCKED,
                    HTTP_STATUS.FORBIDDEN
                )
            }

            if (customer.isAdmin) {
                throw new CustomError(
                    ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                    HTTP_STATUS.FORBIDDEN
                )
            }
            
            if (user.password) {
                const passMatch = await this._passwordBcrypt.compare(
                    user.password,
                    customer.password
                )

                if (!passMatch) {
                    throw new CustomError(
                        ERROR_MESSAGES.INVALID_CREDENTIALS,
                        HTTP_STATUS.BAD_REQUEST
                    )
                }
            }
            return customer;
        } catch (error) {
            console.error("Error in login execution:", error)
            throw error;
        }
    }
}