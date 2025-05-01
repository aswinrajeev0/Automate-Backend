import { IReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";
import { IWorkshopReviewEntity } from "../../models/review.entity";

export interface ISubmitReviewUseCase {
    execute(customerId: string, data: Partial<IWorkshopReviewEntity>): Promise<IReviewModel>
}