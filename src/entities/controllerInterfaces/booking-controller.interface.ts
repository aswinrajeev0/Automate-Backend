import { NextFunction, Request, Response } from "express";

export interface IBookingController {
    getBookedSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    bookSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllWorkshopBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    changeStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    isSlotAvailable(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAllCustomerBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
    allAdminBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
}