import { inject, injectable } from "tsyringe";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { IChangeWorkshopPasswordUseCase } from "../../entities/useCaseInterfaces/workshop/change-password.usecase.interface";


@injectable()
export class ChangeWorkshopPasswordUseCase implements IChangeWorkshopPasswordUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }
    async execute(workshopId: string, data: { oldPassword: string; newPassword: string; confirmPassword: string; }): Promise<void> {
        const { oldPassword, newPassword, confirmPassword } = data;

        const workshop = await this._workshopRepo.findById(workshopId);
        if (!workshop) {
            throw new CustomError(
                ERROR_MESSAGES.WORKSHOP_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const passMatch = await this._passwordBcrypt.compare(oldPassword, workshop.password)
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

        await this._workshopRepo.findByIdAndUpdate(workshopId, updates)
    }
}