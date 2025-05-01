import { IWorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";

export interface IAllWorkshopSlotsUseCase {
    execute(workshopId: string): Promise<IWorkshopSlotModel[]>
}