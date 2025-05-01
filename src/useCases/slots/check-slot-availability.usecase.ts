import { inject, injectable } from "tsyringe";
import { ICheckSlotAvailabilityUseCase } from "../../entities/useCaseInterfaces/slots/check-slot-availability.usecase.interface";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { RedisClient } from "../../frameworks/redis/redisClient";

const redisClient = new RedisClient()

@injectable()
export class CheckSlotAvailabilityUseCase implements ICheckSlotAvailabilityUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository
    ) { }

    async execute(slotId: string): Promise<boolean> {
        const slot = await this._slotRepo.findById(slotId)
        if (!slot) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const isSlotAvailable = await redisClient.saveSlotId(slotId);

        return slot.isAvailable && isSlotAvailable;
    }
}