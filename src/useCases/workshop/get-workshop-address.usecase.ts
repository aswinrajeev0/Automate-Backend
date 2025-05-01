import { injectable, inject } from "tsyringe";
import { IGetWorkshopAddressUseCase } from "../../entities/useCaseInterfaces/workshop/get-workshop-address.usecase.interface";
import { IWorkshopEntity } from "../../entities/models/workshop.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetWorkshopAddressUseCase implements IGetWorkshopAddressUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ){}

    async execute(workshopId: string | undefined): Promise<Partial<IWorkshopEntity>> {
        if(!workshopId){
            throw new CustomError(
                ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                HTTP_STATUS.UNAUTHORIZED
            )
        }

        const workshop = await this._workshopRepo.findById(workshopId)
        if(!workshop){
            throw new CustomError(
                ERROR_MESSAGES.WORKSHOP_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return {
            country: workshop?.country,
            state: workshop?.state,
            city: workshop?.city,
            streetAddress: workshop?.streetAddress,
            buildingNo: workshop?.buildingNo
        }
    }
}