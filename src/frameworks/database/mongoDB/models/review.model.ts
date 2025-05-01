import { Document, Types, model } from "mongoose";
import { IWorkshopReviewEntity } from "../../../../entities/models/review.entity";
import { reviewSchema } from "../schemas/review.schema";

export interface IReviewModel extends Omit<IWorkshopReviewEntity, "id" | "workshopId" | "userId">, Document {
    _id: Types.ObjectId;
    workshopId: Types.ObjectId;
    userId: Types.ObjectId;
}

export const ReviewModel = model<IReviewModel>('Review', reviewSchema)