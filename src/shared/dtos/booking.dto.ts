export interface BookingDto {
    customer: string;
    customerId: string;
    customerPhone: number;
    bookingId: string;
    price: number;
    gst: number;
    amount: number;
    time: string;
    type: string;
    endTime: string;
    date: Date;
    status: string;
}