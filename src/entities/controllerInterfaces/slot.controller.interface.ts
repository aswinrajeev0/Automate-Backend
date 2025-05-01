import { NextFunction, Request, Response } from "express";

export interface ISlotController {
    getSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    createSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAvailableDates(req: Request, res: Response, next: NextFunction): Promise<void>;
    checkSlotAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    saveSlotId(req: Request, res: Response, next: NextFunction): Promise<void>;
}