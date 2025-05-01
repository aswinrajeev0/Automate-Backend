import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IEditWorkshopAddressUseCase {
    execute(workshopId: string | undefined,data: Partial<IWorkshopEntity>): Promise<Partial<IWorkshopEntity>>
}