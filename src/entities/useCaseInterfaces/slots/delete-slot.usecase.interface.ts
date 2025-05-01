import { IWorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";

export interface IDeleteSlotUseCase {
    execute(slotId: string): Promise<IWorkshopSlotModel>
}