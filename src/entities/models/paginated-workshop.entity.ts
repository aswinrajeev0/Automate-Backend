import { IWorkshopEntity } from "./workshop.entity";

export interface PaginatedWorkshops {
    workshops: IWorkshopEntity[] | [],
    total: number
}