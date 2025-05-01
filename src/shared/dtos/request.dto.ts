export interface IRequestDto {
    requestId: string,
    name: string;
    workshop: {
        name: string
    };
    amount: number;
    status: string;
    type: string;
    date: Date;
    vehicleNo: string;
    carType: string;
    carBrand: string;
    location: string;
    image?: string;
    gst: number;
    description?: string;
    notes?: string;
    mobile: string
}