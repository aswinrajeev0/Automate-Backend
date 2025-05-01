import { IWorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";

export interface IToggleAvailabilityUseCase {
    execute(slotId: string, isAvailabe: boolean): Promise<IWorkshopSlotModel>;
}