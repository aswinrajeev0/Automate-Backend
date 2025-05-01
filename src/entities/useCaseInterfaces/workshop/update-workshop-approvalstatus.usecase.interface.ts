import { IWorkshopEntity } from "../../models/workshop.entity";

export interface IUpdateWorkshopApprovalStatusUseCase {
    execute(workshopId: string, status: "approved" | "rejected" | "pending", reason?: string): Promise<IWorkshopEntity>
}