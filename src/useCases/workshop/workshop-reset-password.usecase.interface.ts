import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { ITokenService } from "../../entities/serviceInterfaces.ts/token-service.interface";
import { IWorkshopResetPasswordUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-resetPassword-usecase.interface";
import { inject, injectable } from "tsyringe";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { passwordSchema } from "../../shared/validations/password.validation";

@injectable()
export class WorkshopResetPasswordUseCase implements IWorkshopResetPasswordUseCase {
    constructor(
        @inject("ITokenService") private _tokenService: ITokenService,
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }

    async execute(token: string, password: string, cpassword: string): Promise<void> {
        if(!token) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.UNAUTHORIZED
            )
        }

        if(password !== cpassword) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_CREDENTIALS,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        passwordSchema.parse(password);

        const decoded = await this._tokenService.decodeResetToken(token);
        if(!decoded || !decoded.email) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.UNAUTHORIZED
            )
        }
        const email = decoded.email;
        let hashedPassword = await this._passwordBcrypt.hash(password)
        const update = {
            password: hashedPassword
        }

        await this._workshopRepo.updateByEmail(email, update)
    }
}