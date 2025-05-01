import { inject, injectable } from "tsyringe";
import { IUpdateRequestStatusUseCase, TType } from "../../entities/useCaseInterfaces/requests/update-request-status.usecase.interface";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class UpdateRequestStatusUseCase implements IUpdateRequestStatusUseCase {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository
    ){}

    async execute(requestId: string, status: TType): Promise<IRequestModel> {
        const request = await this._requestRepo.findOneAndUpdate({requestId},{status})
        if(!request) {
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }
        return request
    }
}