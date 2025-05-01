import { inject, injectable } from "tsyringe";
import { IUserEntity } from "../../entities/models/user.entity";
import { IAdminLoginUseCase } from "../../entities/useCaseInterfaces/admin/admin-login-usecase.interface";
import { AdminLoginDTO } from "../../shared/dtos/auth.dto";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";

@injectable()
export class AdminLoginUseCase implements IAdminLoginUseCase {

    constructor(
        @inject("ICustomerRepository") private _adminRepo: ICustomerRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }

    async execute(user: AdminLoginDTO): Promise<Partial<IUserEntity>> {
        const admin = await this._adminRepo.findByEmail(user.email)
        if (!admin) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        if(!admin.isAdmin){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_CREDENTIALS,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if(user.password){
            const passMatch = await this._passwordBcrypt.compare(user.password, admin.password)
            if(!passMatch){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }
        }

        return admin;
    }
}
