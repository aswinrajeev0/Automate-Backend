export interface ReviewDTO {
    userId: string
    workshopId: string,
    rating: string,
    comment?: string,
    reviewId: string
}

export interface IPopulatedReview {
    _id: string;
    reviewId: string;
    workshopId: { _id: string; name: string; image: string };
    userId: { _id: string; name: string, image: string };
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}