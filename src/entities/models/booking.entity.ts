export interface IBookingEntity {
    id: string
    bookingId: string,
    customerId: string,
    workshopId: string,
    date: Date,
    time: string,
    type: string,
    endTime: string,
    duration: number,
    price: number,
    amount: number,
    gst?: number,
    status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
    slotId: string
}