import { IWorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";

export interface IFetchAvailableSlotsUseCase {
    execute(workshopId: string, selectedDate: string, type: "basic" | "interim" | "full"): Promise<IWorkshopSlotModel[]>
}