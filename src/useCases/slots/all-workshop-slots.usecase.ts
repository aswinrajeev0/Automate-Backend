import { inject, injectable } from "tsyringe";
import { IAllWorkshopSlotsUseCase } from "../../entities/useCaseInterfaces/slots/all-workshop-slots.usecase.interface";
import { IWorkshopSlotModel } from "../../frameworks/database/mongoDB/models/workshop-slot.model";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";

@injectable()
export class AllWorkshopSlotsUseCase implements IAllWorkshopSlotsUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository
    ){}

    async execute(workshopId: string): Promise<IWorkshopSlotModel[]> {
        const slots = await this._slotRepo.getAllWorkshopSlots({workshopId});
        return slots
    }
}