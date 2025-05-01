export interface IWorkshopEntity {
    workshopId?: string,
    id?: string;
    image?: string;
    name: string;
    email: string;
    phone: string;
    bio?: string;
    password: string;
    country: string;
    state: string;
    city: string;
    streetAddress: string;
    buildingNo: string;
    description?: string;
    approvalStatus: "approved" | "rejected" | "pending";
    rejectionReason: string;
    isActive: boolean;
    isRejected: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}