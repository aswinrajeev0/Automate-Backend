import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IEditWorkshopUseCase {
    execute(workshopId: string | undefined,data: Partial<IWorkshopEntity>): Promise<Partial<IWorkshopEntity>>
}