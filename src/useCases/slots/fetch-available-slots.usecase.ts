import { inject, injectable } from "tsyringe";
import { IFetchAvailableSlotsUseCase } from "../../entities/useCaseInterfaces/slots/fetch-available-slots.usecase.interface";
import { IWorkshopSlotModel } from "../../frameworks/database/mongoDB/models/workshop-slot.model";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { date } from "zod";

@injectable()
export class FetchAvailableSlotsUseCase implements IFetchAvailableSlotsUseCase {
    constructor(
        @inject("ISlotRepository") private _slotRepo: ISlotRepository,
    ){}

    async execute(workshopId: string, selectedDate: string, type: "basic" | "interim" | "full"): Promise<IWorkshopSlotModel[]> {
        const filter = {
            workshopId,
            date: selectedDate,
            serviceType: type
        }
        const slots = await this._slotRepo.find(filter)

        return slots;
    }
}