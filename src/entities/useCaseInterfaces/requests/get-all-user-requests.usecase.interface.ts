import { IRequestDto } from "../../../shared/dtos/request.dto";

export interface IGetAllUserRequestsUseCase {
    execute(customerId: string, skip: number, limit: number): Promise<{requests: IRequestDto[], total: number}>;
}