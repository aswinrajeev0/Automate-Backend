export interface CreateSlotsDTO {
    date: string;
    startTime: string;
    endTime: string;
    serviceType: 'basic' | 'interim' | 'full';
    maxBookings: number;
    currentBookings: number;
    isAvailable: boolean;
} 