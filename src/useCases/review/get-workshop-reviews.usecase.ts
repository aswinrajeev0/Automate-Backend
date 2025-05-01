import { inject, injectable } from "tsyringe";
import { IWorkshopReviewsUseCase } from "../../entities/useCaseInterfaces/review/get-workshop-reviews.usecase.interface";
import { IReviewModel } from "../../frameworks/database/mongoDB/models/review.model";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class WorkshopReviewsUseCase implements IWorkshopReviewsUseCase {
    constructor(
        @inject("IReviewRepository") private _reviewRepo: IReviewRepository
    ){}

    async execute(workshopId: string): Promise<IReviewModel[]> {
        const reviews = await this._reviewRepo.find({workshopId})

        if(!reviews) {
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        return reviews
    }
}