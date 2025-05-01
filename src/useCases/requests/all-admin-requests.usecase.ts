import { inject, injectable } from "tsyringe";
import { IAdminRequestUsecase } from "../../entities/useCaseInterfaces/requests/all-admin-requests.usecase.interface";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";

@injectable()
export class AdminRequestsUseCase implements IAdminRequestUsecase {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository
    ) { }

    async allRequests(skip: number, limit: number, search: string): Promise<{ requests: IRequestModel[]; total: number; }> {
        const filter: any = {}
        if (search) {
            filter.$or = [
                { requestId: { $regex: search, $options: "i" } },
                { vehicleNo: { $regex: search, $options: "i" } }
            ]
        }
        const { requests, total } = await this._requestRepo.find(filter, skip, limit)

        return {requests, total}
    }
}