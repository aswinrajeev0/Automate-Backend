import { inject, injectable } from "tsyringe";
import { ISubmitReviewUseCase } from "../../entities/useCaseInterfaces/review/submit-review.usecase.interface";
import { IWorkshopReviewEntity } from "../../entities/models/review.entity";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";
import { IReviewModel } from "../../frameworks/database/mongoDB/models/review.model";

@injectable()
export class SubmitReviewUseCase implements ISubmitReviewUseCase {
    constructor(
        @inject("IReviewRepository") private _reviewRepo: IReviewRepository,
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository
    ){}

    async execute(customerId: string, data: Partial<IWorkshopReviewEntity>): Promise<IReviewModel> {
        const customer = await this._customerRepo.findById(customerId);
        if(!customer) {
            throw new CustomError(
                ERROR_MESSAGES.USER_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const reviewId = generateUniqueId("rev")
        

        const review = await this._reviewRepo.save({...data, userId: customerId, reviewId, })
        return review
    }
}