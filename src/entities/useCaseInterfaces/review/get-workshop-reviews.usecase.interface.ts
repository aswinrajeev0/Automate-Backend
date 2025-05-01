import { IReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";

export interface IWorkshopReviewsUseCase {
    execute(workshopId: string): Promise<IReviewModel[]>
}