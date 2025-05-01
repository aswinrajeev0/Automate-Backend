import { Document, ObjectId, model } from "mongoose";
import { customerSchema } from "../schemas/customer.schema";
import { ICustomerEntity } from "../../../../entities/models/customer.entity";

export interface ICustomerModel extends Omit<ICustomerEntity, "id">, Document {
    _id: ObjectId;
}

export const CustomerModel = model<ICustomerModel>('Customer', customerSchema)