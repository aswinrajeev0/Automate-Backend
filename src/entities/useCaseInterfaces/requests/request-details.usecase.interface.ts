import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";

export interface IRequestDetailsUseCase {
    execute(requestId: string): Promise<IRequestModel>
}