import { model, Types } from "mongoose";
import { IWorkshopSlotEntity } from "../../../../entities/models/workshop-slot.entity";
import { workshopSlotSchema } from "../schemas/workshop-slot.schema";

export interface IWorkshopSlotModel extends Omit<IWorkshopSlotEntity, "id" | "workshopId"> {
    _id: Types.ObjectId;
    workshopId: Types.ObjectId;
}

export const WorkshopSlotModel = model<IWorkshopSlotModel>('WorkshopSlot', workshopSlotSchema)