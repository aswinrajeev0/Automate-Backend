import { inject, injectable } from "tsyringe";
import { IBookingController } from "../../entities/controllerInterfaces/booking-controller.interface";
import { Request, Response, NextFunction } from "express";
import { IGetBookedSlotsUseCase } from "../../entities/useCaseInterfaces/bookings/get-booked-slots.usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IBookSlotUseCase } from "../../entities/useCaseInterfaces/bookings/slot-book.usecase.interface";
import { ICancelSlotUseCase } from "../../entities/useCaseInterfaces/bookings/cancel-slot.usecase.interface";
import { IGetAllWorkshopBookingUseCase } from "../../entities/useCaseInterfaces/bookings/get-all-workshop-bookings.usecase.interface";
import { ICancelBookingUseCase } from "../../entities/useCaseInterfaces/bookings/cancel-booking.usecase.interface";
import { IChangeBookingStatusUseCase } from "../../entities/useCaseInterfaces/bookings/change-booking-status.usecase.interface";
import { IIsSlotAvailableUseCase } from "../../entities/useCaseInterfaces/bookings/is-slot-available.usecase";
import { string } from "zod";
import { tryCatch } from "bullmq";
import { IGetAllCustomerBookingsUseCase } from "../../entities/useCaseInterfaces/bookings/get-all-customer-bookings.usecase.intrface";
import { IAllAdminBookingsUseCase } from "../../entities/useCaseInterfaces/bookings/all-admin-bookings.usecase.interface";

@injectable()
export class BookingController implements IBookingController {
    constructor(
        @inject("IGetBookedSlotsUseCase") private _getBookedSlots: IGetBookedSlotsUseCase,
        @inject("IBookSlotUseCase") private _bookSlot: IBookSlotUseCase,
        @inject("ICancelSlotUseCase") private _cancelSlot: ICancelSlotUseCase,
        @inject("IGetAllWorkshopBookingUseCase") private _getAllWorkshopBooking: IGetAllWorkshopBookingUseCase,
        @inject("ICancelBookingUseCase") private _cancelBooking: ICancelBookingUseCase,
        @inject("IChangeBookingStatusUseCase") private _changeBookingStatus: IChangeBookingStatusUseCase,
        @inject("IIsSlotAvailableUseCase") private _isSlotAvailable: IIsSlotAvailableUseCase,
        @inject("IGetAllCustomerBookingsUseCase") private _getAllCustomerBookings: IGetAllCustomerBookingsUseCase,
        @inject("IAllAdminBookingsUseCase") private _adminBookings: IAllAdminBookingsUseCase
    ) { }

    async getBookedSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.params.workshopId;
            const type = req.query.type as string
            const bookings = await this._getBookedSlots.execute(workshopId, type)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                bookings
            })
        } catch (error) {
            next(error)
        }
    }

    async bookSlot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const booking = await this._bookSlot.execute(data)
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
                booking
            })
        } catch (error) {
            next(error)
        }
    }

    async cancelslot(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { bookingId } = req.params;

            if (!bookingId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            const bookindDoc = await this._cancelSlot.execute(bookingId)

            const booking = {
                bookingId: bookindDoc.bookingId,
                customerId: bookindDoc.customerId,
                workshopId: bookindDoc.workshopId,
                date: bookindDoc.date,
                time: bookindDoc.time,
                type: bookindDoc.type,
                endTime: bookindDoc.endTime,
                duration: bookindDoc.duration
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING_CANCELED,
                booking
            })

        } catch (error) {
            next(error)
        }
    }

    async getAllWorkshopBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            if (!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const page = Number(req.query.page);
            const limit = Number(req.query.limit);
            const skip = (page - 1) * limit;
            const searchString = req.query.searchTerm as string;
            const status = req.query.statusFilter as string

            const { bookings, total } = await this._getAllWorkshopBooking.execute(workshopId, skip, limit, searchString, status);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                bookings,
                totalBookings: total
            })

        } catch (error) {
            next(error)
        }
    }

    async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { bookingId } = req.body;

            if (!bookingId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            const booking = await this._cancelBooking.execute(bookingId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking
            })

        } catch (error) {
            next(error)
        }
    }

    async changeStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { status, bookingId } = req.body;
            if (!bookingId) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            const booking = await this._changeBookingStatus.execute(bookingId, status)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                booking
            })

        } catch (error) {
            next(error)
        }
    }

    async isSlotAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { date, time, endTime } = req.query
            const data = {
                date: new Date(date as string),
                time: time as string,
                endTime: endTime as string
            }
            const isSlotAvailable = await this._isSlotAvailable.execute(data)

            res.status(HTTP_STATUS.OK).json({
                isSlotAvailable
            })

        } catch (error) {
            next(error)
        }
    }

    async getAllCustomerBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return
            }

            const { page, limit } = req.query;

            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const skip = (pageNumber - 1) * limitNumber

            const { bookings, total } = await this._getAllCustomerBookings.execute(customerId, skip, limitNumber);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                bookings,
                totalBookings: total
            })

        } catch (error) {
            next(error)
        }
    }

    async allAdminBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {page, limit, filter} = req.query;
            const pageNumber = Number(page)
            const limitNumber = Number(limit)
            const skip = (pageNumber - 1) * limitNumber;

            const {bookings, totalBookings} = await this._adminBookings.execute(skip, limitNumber, filter as string)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                bookings,
                totalBookings
            })

        } catch (error) {
            next(error)
        }
    }

}