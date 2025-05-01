import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IAdminRequestUsecase {
    allRequests(skip: number, limit: number, search: string): Promise<{requests: IRequestModel[]; total: number}>
}