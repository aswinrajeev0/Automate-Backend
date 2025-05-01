import { inject, injectable } from "tsyringe";
import { IWorkshopLoginUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-login-usecase.interface";
import { WorkshopLoginDTO } from "../../shared/dtos/auth.dto";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";

@injectable()
export class WorkshopLoginUseCase implements IWorkshopLoginUseCase {

    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }

    async execute(data: WorkshopLoginDTO): Promise<Partial<IWorkshopEntity>> {
        const workshop = await this._workshopRepo.findByEmail(data.email);
        if (!workshop) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_CREDENTIALS,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        if(workshop.approvalStatus === "pending" || workshop.approvalStatus === "rejected"){
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                HTTP_STATUS.FORBIDDEN
            )
        }

        if (workshop.isBlocked) {
            throw new CustomError(
                ERROR_MESSAGES.BLOCKED,
                HTTP_STATUS.FORBIDDEN
            )
        }

        if (data.password) {
            const passMatch = await this._passwordBcrypt.compare(data.password, workshop.password);
            if(!passMatch){
                throw new CustomError(
                    ERROR_MESSAGES.INVALID_CREDENTIALS,
                    HTTP_STATUS.BAD_REQUEST
                )
            }
        }

        return workshop;
    }
}