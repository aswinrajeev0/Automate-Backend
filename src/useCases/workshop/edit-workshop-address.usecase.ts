import { inject, injectable } from "tsyringe";
import { IEditWorkshopAddressUseCase } from "../../entities/useCaseInterfaces/workshop/edit-workshop-address.usecase.interface";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";


@injectable()
export class EditWorkshopAddressUseCase implements IEditWorkshopAddressUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ){}

    async execute(workshopId: string | undefined, data: Partial<IWorkshopEntity>): Promise<Partial<IWorkshopEntity>> {
        if(!workshopId) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_CREDENTIALS,
                HTTP_STATUS.BAD_REQUEST
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

        const workshop = await this._workshopRepo.findByIdAndUpdate(workshopId, updates)
        if(!workshop) {
            throw new CustomError(
                ERROR_MESSAGES.WORKSHOP_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return workshop;
    }
}