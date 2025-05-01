export interface IWorkshopReviewEntity {
    reviewId: string;
    workshopId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
