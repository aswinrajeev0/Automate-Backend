import { inject, injectable } from "tsyringe";
import { IToggleAvailabilityUseCase } from "../../entities/useCaseInterfaces/slots/toggle-availability.usecase.interface";
import { IWorkshopSlotModel } from "../../frameworks/database/mongoDB/models/workshop-slot.model";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class ToggleAvailabilityUseCase implements IToggleAvailabilityUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository,
    ) { }

    async execute(slotId: string, isAvailabe: boolean): Promise<IWorkshopSlotModel> {

        const update = {
            isAvailable: !isAvailabe
        }

        const slot = await this._slotRepo.findByIdAndUpdate(slotId, update)

        if (!slot) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return slot;
    }
}