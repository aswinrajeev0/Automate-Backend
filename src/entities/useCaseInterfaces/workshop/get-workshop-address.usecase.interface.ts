import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IGetWorkshopAddressUseCase {
    execute(workshopId: string | undefined): Promise<Partial<IWorkshopEntity>>
}