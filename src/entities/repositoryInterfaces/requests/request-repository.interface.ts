import { IRequestModel } from "../../../frameworks/database/mongoDB/models/request.model";
import { IRequestEntity } from "../../models/request.entity";

export interface IRequestRepository {
    save(data: Partial<IRequestEntity>):Promise<IRequestModel>
    find(condition: Partial<IRequestEntity>, skip: number, limit: number): Promise<{requests: IRequestModel[] | []; total: number}>
    findOne(filter: Partial<IRequestEntity>): Promise<IRequestModel | null>;
    findOneAndUpdate(filter: Partial<IRequestEntity>, updates: Partial<IRequestEntity>): Promise<IRequestModel | null>;
    totalRequests(filter: Partial<IRequestEntity>): Promise<number>
}