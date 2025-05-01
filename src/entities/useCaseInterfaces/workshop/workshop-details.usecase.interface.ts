import { IReviewModel } from "../../../frameworks/database/mongoDB/models/review.model";
import { IWorkshopReviewEntity } from "../../models/review.entity";
import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IWorkshopDetailsUseCase {
    execute(id: string): Promise<{ workshop: Partial<IWorkshopEntity>; reviews: IReviewModel[] }>
}