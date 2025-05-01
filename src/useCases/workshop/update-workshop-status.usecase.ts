import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { IUpdateWorkshopStatusUseCase } from "../../entities/useCaseInterfaces/workshop/update-worksho-status-usecase.interface";
import { inject, injectable } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateWorkshopStatusUseCase implements IUpdateWorkshopStatusUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ){}

    async execute(workshopId: string): Promise<void> {
        if(!workshopId){
            throw new CustomError(
                ERROR_MESSAGES.MISSING_PARAMETERS,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        await this._workshopRepo.updateBlockStatus(workshopId)
    }
}