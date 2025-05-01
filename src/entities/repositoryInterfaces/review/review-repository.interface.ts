import { FilterQuery } from "mongoose";
import { IReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";
import { IWorkshopReviewEntity } from "../../models/review.entity";

export interface IReviewRepository {
    find(condition: FilterQuery<IReviewModel>): Promise<IReviewModel[] | null>;
    findOneAndUpdate(condition: FilterQuery<IReviewModel>, update: Partial<IWorkshopReviewEntity>): Promise<IReviewModel | null>
    save(data: Partial<IWorkshopReviewEntity>): Promise<IReviewModel>
}