import { Document, model, ObjectId } from "mongoose";
import { IRequestEntity } from "../../../../entities/models/request.entity";
import { requestSchema } from "../schemas/request.schema";

export interface IRequestModel extends Omit<IRequestEntity, "id"|"workshopId"|"customerId">, Document{
    _id: ObjectId;
    workshopId: ObjectId;
    customerId: ObjectId;
}

export const RequestModel = model<IRequestModel>(
    "Request",
    requestSchema
);