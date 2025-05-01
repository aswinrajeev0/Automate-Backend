import { injectable } from "tsyringe";
import { ISaveSlotIdUseCase } from "../../entities/useCaseInterfaces/slots/save-slot-id.usecase.interface";
import { RedisClient } from "../../frameworks/redis/redisClient";

const redisClient = new RedisClient()

@injectable()
export class isSlot implements ISaveSlotIdUseCase {
    constructor(

    ){}

    async execute(slotId: string): Promise<boolean> {
        const isSlotAvailable = await redisClient.saveSlotId(slotId);
        return isSlotAvailable;
    }
}