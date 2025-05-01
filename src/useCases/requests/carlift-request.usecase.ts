import { inject, injectable } from "tsyringe";
import { ICarLiftRequestUseCase } from "../../entities/useCaseInterfaces/requests/carlift-request.usecase.interface";
import { IRequestEntity } from "../../entities/models/request.entity";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class CarLiftRequestUseCase implements ICarLiftRequestUseCase {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository
    ){}

    async execute(data: Partial<IRequestEntity>): Promise<IRequestModel> {
        if(!data) {
            throw new CustomError(
                ERROR_MESSAGES.DATA_MISSING,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const requestId = generateUniqueId("rqst");

        const request = await this._requestRepo.save({...data, requestId})

        return request
    }
}
