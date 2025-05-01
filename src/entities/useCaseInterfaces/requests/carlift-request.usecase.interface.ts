import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";
import { IRequestEntity } from "../../models/request.entity";

export interface ICarLiftRequestUseCase {
    execute(data: Partial<IRequestEntity>): Promise<IRequestModel>
}