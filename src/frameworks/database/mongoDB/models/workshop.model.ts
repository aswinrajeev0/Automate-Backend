import { model, ObjectId, Document } from "mongoose";
import { IWorkshopEntity } from "../../../../entities/models/workshop.entity";
import { workshopSchema } from "../schemas/workshop.schema";

export interface IWorkshopModel extends Omit<IWorkshopEntity, "id">, Document {
    _id: ObjectId,
    workshopId: string
};

export const WorkshopModel = model<IWorkshopModel>('Workshop', workshopSchema);