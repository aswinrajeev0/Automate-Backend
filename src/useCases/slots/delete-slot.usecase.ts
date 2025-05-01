import { inject, injectable } from "tsyringe";
import { IDeleteSlotUseCase } from "../../entities/useCaseInterfaces/slots/delete-slot.usecase.interface";
import { IWorkshopSlotModel } from "../../frameworks/database/mongoDB/models/workshop-slot.model";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class DeleteSlotUseCase implements IDeleteSlotUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository,
    ){}

    async execute(slotId: string): Promise<IWorkshopSlotModel> {
        const slot = await this._slotRepo.deleteSlot(slotId)
        if(!slot) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return slot;
    }
}