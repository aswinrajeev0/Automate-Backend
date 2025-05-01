export interface IWorkshopSlotEntity {
    id: string;
    workshopId: string;
    date: string;
    startTime: string;
    endTime: string;
    serviceType: "basic" | "interim" | "full";
    maxBookings: number;
    currentBookings: number;
    isBooked: boolean;
    isAvailable: boolean;
}