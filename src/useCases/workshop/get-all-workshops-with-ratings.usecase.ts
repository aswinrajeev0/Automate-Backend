import { inject, injectable } from "tsyringe";
import { IGetAllWorkshopsWithRatingUseCase } from "../../entities/useCaseInterfaces/workshop/get-all-workshops-with-rating.usecase.interface";
import { IWorkshopWithRatings } from "../../entities/models/workshop-with-rating.entity";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { ReviewModel } from "../../frameworks/database/mongoDB/models/review.model";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class GetAllWorkshopsWithRatingUseCase implements IGetAllWorkshopsWithRatingUseCase {
    constructor(
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository
    ) { }

    async execute(page: number, limit: number, searchTerm: string, sort: string): Promise<{ workshops: Partial<IWorkshopWithRatings[]>; total: number }> {
        const skip = (page - 1) * limit;

        let sortOption;
        if (sort) {
            switch (sort) {
                case "alphabetic-asc":
                    sortOption = {name: 1}
                    break
                case "alphabetic-desc":
                    sortOption = {name: -1}
                    break
                case "rating-high":
                    sortOption = { averageRating: -1 };
                    break
                case "rating-low":
                    sortOption = { averageRating: 1 };
                    break
                default:
                    sortOption = {createdAt: -1}
                    break
            }
        }
        const { workshops, total } = await this._workshopRepo.getWorkshopsWithRatings(skip, limit, searchTerm, sortOption)
        if (!workshops) {
            throw new CustomError(
                ERROR_MESSAGES.WORKSHOP_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return { workshops, total }
    }
}