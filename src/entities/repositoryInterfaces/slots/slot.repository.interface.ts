import { IWorkshopSlotModel } from "../../../frameworks/database/mongoDB/models/workshop-slot.model";
import { IWorkshopSlotEntity } from "../../models/workshop-slot.entity";

export interface ISlotRepository {
    getAllWorkshopSlots(filter: Partial<IWorkshopSlotEntity>): Promise<IWorkshopSlotModel[]>;
    createSlots(data: Partial<IWorkshopSlotEntity>[]): Promise<void>;
    deleteSlot(slotId: string): Promise<IWorkshopSlotModel | null>;
    findByIdAndUpdate(slotId: string, update: Partial<IWorkshopSlotEntity>): Promise<IWorkshopSlotModel | null>;
    find(filter: any): Promise<IWorkshopSlotModel[]>
    findById(slotId: string): Promise<IWorkshopSlotModel | null>
}