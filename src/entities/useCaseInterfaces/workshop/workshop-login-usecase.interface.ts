import { WorkshopLoginDTO } from "../../../shared/dtos/auth.dto";
import { IWorkshopEntity } from "../../models/workshop.entity";


export interface IWorkshopLoginUseCase {
    execute(data: WorkshopLoginDTO): Promise<Partial<IWorkshopEntity>>
}