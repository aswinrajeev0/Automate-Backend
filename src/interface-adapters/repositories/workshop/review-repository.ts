import { injectable } from "tsyringe";
import { IReviewRepository } from "../../../entities/repositoryInterfaces/review/review-repository.interface";
import { FilterQuery } from "mongoose";
import { IReviewModel, ReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";
import { IWorkshopReviewEntity } from "../../../entities/models/review.entity";

@injectable()
export class ReviewRepository implements IReviewRepository {
    async find(condition: FilterQuery<IReviewModel>): Promise<IReviewModel[] | null> {
        const reviews = await ReviewModel.find(condition).populate("userId", "name image")
        return reviews
    }

    async findOneAndUpdate(condition: FilterQuery<IReviewModel>, update: Partial<IWorkshopReviewEntity>): Promise<IReviewModel | null> {
        const reveiw = await ReviewModel.findOneAndUpdate(condition, update)
        return reveiw
    }

    async save(data: Partial<IWorkshopReviewEntity>): Promise<IReviewModel> {
        const review = await ReviewModel.create(data);
        return await review.populate("userId", "name image");
    }
}