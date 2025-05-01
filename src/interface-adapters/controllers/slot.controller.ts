import { inject, injectable } from "tsyringe";
import { ISlotController } from "../../entities/controllerInterfaces/slot.controller.interface";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IAllWorkshopSlotsUseCase } from "../../entities/useCaseInterfaces/slots/all-workshop-slots.usecase.interface";
import { IWorkshopSlotEntity } from "../../entities/models/workshop-slot.entity";
import { CreateSlotsDTO } from "../../shared/dtos/slots.dto";
import { ICreateSlotsUseCase } from "../../entities/useCaseInterfaces/slots/create-slots.usecase.interface";
import { IDeleteSlotUseCase } from "../../entities/useCaseInterfaces/slots/delete-slot.usecase.interface";
import { IToggleAvailabilityUseCase } from "../../entities/useCaseInterfaces/slots/toggle-availability.usecase.interface";
import { IFetchAvailableSlotsUseCase } from "../../entities/useCaseInterfaces/slots/fetch-available-slots.usecase.interface";
import { IFetchAvailableDatesUseCase } from "../../entities/useCaseInterfaces/slots/fetch-available-dates.usecase.interface";
import { ICheckSlotAvailabilityUseCase } from "../../entities/useCaseInterfaces/slots/check-slot-availability.usecase.interface";

@injectable()
export class SlotController implements ISlotController {
    constructor(
        @inject("IAllWorkshopSlotsUseCase") private _allWorkshopSlots: IAllWorkshopSlotsUseCase,
        @inject("ICreateSlotsUseCase") private _createSlots: ICreateSlotsUseCase,
        @inject("IDeleteSlotUseCase") private _deleteSlot: IDeleteSlotUseCase,
        @inject("IToggleAvailabilityUseCase") private _toggleAvailability: IToggleAvailabilityUseCase,
        @inject("IFetchAvailableSlotsUseCase") private _availableSlots: IFetchAvailableSlotsUseCase,
        @inject("IFetchAvailableDatesUseCase") private _availableDates: IFetchAvailableDatesUseCase,
        @inject("ICheckSlotAvailabilityUseCase") private _checkSlotAvailability: ICheckSlotAvailabilityUseCase
    ){}

    async getSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            if(!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const slots = await this._allWorkshopSlots.execute(workshopId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                slots
            })

        } catch (error) {
            next(error)
        }
    }

    async createSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            if(!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const data = req.body.data as CreateSlotsDTO[];
            console.log(data)

            const slotsToCreate = data.map((slot: Partial<IWorkshopSlotEntity>) => ({
                ...slot,
                workshopId
            }))

            const slots = await this._createSlots.execute(slotsToCreate)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED,
                slots
            })

        } catch (error) {
            next(error)
        }
    }

    async deleteSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = req.query.slotId as string;
            if(!slotId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            const slot = await this._deleteSlot.execute(slotId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DELETE_SUCCESS,
                slot
            })

        } catch (error) {
            next(error)
        }
    }

    async toggleAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = req.body.slotId as string;
            const isAvailable = req.body.isAvailable;
            if(!slotId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            const slot = await this._toggleAvailability.execute(slotId, isAvailable);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                slot
            })

        } catch (error) {
            next(error)
        }
    }

    async fetchAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.query.workshopId as string;
            const selectedDate = req.query.selectedDate as string;
            const type = req.query.type as "basic" | "interim" | "full";

            const slots = await this._availableSlots.execute(workshopId, selectedDate, type)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                slots
            })

        } catch (error) {
            next(error)
        }
    }

    async fetchAvailableDates(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {workshopId, year, month, serviceType} = req.query
            const availableDates = await this._availableDates.execute(workshopId as string, Number(month), Number(year), serviceType as string);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                availableDates
            })

        } catch (error) {
            next(error)
        }
    }

    async saveSlotId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = req.body.slotId;
            if(!slotId){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.DATA_MISSING
                })
                return;
            }

            await this

        } catch (error) {
            next(error)
        }
    }

    async checkSlotAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const slotId = req.query.slotId as string;
            if(!slotId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }
            const isSlotAvailable = await this._checkSlotAvailability.execute(slotId)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                isSlotAvailable
            })

        } catch (error) {
            next(error)
        }
    }
    
}