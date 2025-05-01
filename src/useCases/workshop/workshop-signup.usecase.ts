import { IWorkshopSignupUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-signup-usecase.interface";
import { inject, injectable } from "tsyringe";
import { WorkshopDTO } from "../../shared/dtos/auth.dto";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class WorkshopSignUpUseCase implements IWorkshopSignupUseCase {

    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IPasswordBcrypt") private _passwordBcrypt: IBcrypt
    ) { }

    async execute(workshop: WorkshopDTO): Promise<IWorkshopEntity> {
        const existingWorkshop = await this._workshopRepo.findByEmail(workshop.email);
        if (existingWorkshop) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_EXISTS,
                HTTP_STATUS.CONFLICT
            )
        }

        let hashedPassword = null;
        if (workshop.password) {
            hashedPassword = await this._passwordBcrypt.hash(workshop.password)
        }

        let workshopId = generateUniqueId("workshop")
        return await this._workshopRepo.save({
            name: workshop.name,
            email: workshop.email,
            phone: workshop.phoneNumber,
            password: hashedPassword ?? "",
            workshopId,
            country: workshop.country,
            state: workshop.state,
            city: workshop.city,
            streetAddress: workshop.streetAddress,
            buildingNo: workshop.buildingNo,
        })
    }
}