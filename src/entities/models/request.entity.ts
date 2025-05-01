export interface IRequestEntity {
    id: string;
    requestId: string,
    name: string;
    mobile: string;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    type: "car-lift" | "mobile-workshop";
    status: "submitted" | "pending" | "on_way" | "in_progress" | "completed" |  "delivered" | "accepted" | "rejected";
    paymentStatus: "pending" | "completed";
    workshopId: string;
    customerId: string;
    image?: string;
    amount: number;
    gst: number;
    description?: string;
    notes?: string;
    createdAt: Date;
    updatesAt: Date;
}
