import { inject, injectable } from "tsyringe";
import { ICreateSlotsUseCase } from "../../entities/useCaseInterfaces/slots/create-slots.usecase.interface";
import { IWorkshopSlotEntity } from "../../entities/models/workshop-slot.entity";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";

@injectable()
export class CreateSlotsUseCase implements ICreateSlotsUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository,
    ){}

    async execute(data: Partial<IWorkshopSlotEntity>[]): Promise<void> {
        const slots = await this._slotRepo.createSlots(data)
    }
}