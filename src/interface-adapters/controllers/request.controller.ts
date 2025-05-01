import { inject, injectable } from "tsyringe";
import { IRequestController } from "../../entities/controllerInterfaces/request-controller.interface";
import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { ICarLiftRequestUseCase } from "../../entities/useCaseInterfaces/requests/carlift-request.usecase.interface";
import { carLiftRequestValidationSchema, mobileWorkshopRequestValidationSchema } from "./validations/request.validation";
import { IMobileWorkshopRequestUseCase } from "../../entities/useCaseInterfaces/requests/mobileworkshop-request.usecase.interface";
import { IAllPendingRequestsUseCAse } from "../../entities/useCaseInterfaces/requests/all-pending-request.usecase.interface";
import { IRequestDetailsUseCase } from "../../entities/useCaseInterfaces/requests/request-details.usecase.interface";
import { IAcceptRequestUseCase } from "../../entities/useCaseInterfaces/requests/update-request.usecase.interface";
import { IRejectRequestUSeCase } from "../../entities/useCaseInterfaces/requests/reject-request.usecase.interface";
import { IPendingJobsUseCase } from "../../entities/useCaseInterfaces/requests/pending-jobs.usecase.interface";
import { IUpdateRequestStatusUseCase } from "../../entities/useCaseInterfaces/requests/update-request-status.usecase.interface";
import { IFinishedJobsUseCase } from "../../entities/useCaseInterfaces/requests/finished-jobs.usecase.interface";
import { IGetAllUserRequestsUseCase } from "../../entities/useCaseInterfaces/requests/get-all-user-requests.usecase.interface";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";
import { IAdminRequestUsecase } from "../../entities/useCaseInterfaces/requests/all-admin-requests.usecase.interface";

@injectable()
export class RequestController implements IRequestController {
    constructor(
        @inject("ICarLiftRequestUseCase") private _carLiftRequest: ICarLiftRequestUseCase,
        @inject("IMobileWorkshopRequestUseCase") private _mobileWorkshop: IMobileWorkshopRequestUseCase,
        @inject("IAllPendingRequestsUseCAse") private _pendingRequests: IAllPendingRequestsUseCAse,
        @inject("IRequestDetailsUseCase") private _requestDetails: IRequestDetailsUseCase,
        @inject("IAcceptRequestUseCase") private _acceptRequest: IAcceptRequestUseCase,
        @inject("IRejectRequestUSeCase") private _rejectRequest: IRejectRequestUSeCase,
        @inject("IPendingJobsUseCase") private _pendingJobs: IPendingJobsUseCase,
        @inject("IUpdateRequestStatusUseCase") private _updateRequestStatus: IUpdateRequestStatusUseCase,
        @inject("IFinishedJobsUseCase") private _finishedJobs: IFinishedJobsUseCase,
        @inject("IGetAllUserRequestsUseCase") private _getAllUserRequests: IGetAllUserRequestsUseCase,
        @inject("IAdminRequestUsecase") private _adminRequests: IAdminRequestUsecase,
    ) { }

    async carLift(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            const data = req.body
            const { workshopId, image } = data;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ROLE
                })
                return
            }

            const schema = carLiftRequestValidationSchema

            const validatedData = schema.parse(data)

            const request = await this._carLiftRequest.execute({ ...validatedData, customerId, workshopId, image })

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
                request
            })

        } catch (error) {
            next(error)
        }
    }

    async mobileWorkshop(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            const data = req.body;
            const { workshopId } = data;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.INVALID_ROLE
                })
                return
            }

            const schema = mobileWorkshopRequestValidationSchema;
            const validatedData = schema.parse(data)

            const request = await this._mobileWorkshop.execute({ ...validatedData, workshopId, customerId })
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.BOOKING_SUCCESS,
                request
            })
        } catch (error) {
            next(error)
        }
    }

    async allPendingRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const { page = 1, limit = 10, searchTerm = "" } = req.query;
            if (!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return
            }

            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof searchTerm === "string" ? searchTerm : "";

            const { requests, total } = await this._pendingRequests.execute(workshopId, pageNumber, pageSize, searchTermString)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests: requests.map(request => ({
                    name: request.name,
                    requestId: request.requestId,
                    vehicleNo: request.vehicleNo,
                    location: request.location,
                    date: request.createdAt,
                    type: request.type,
                })),
                totaPages: total,
                currentPage: pageNumber
            })
        } catch (error) {
            next(error)
        }
    }

    async requestDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestId = req.params.requestId;
            if (!requestId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
            }
            const request = await this._requestDetails.execute(requestId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                request
            })
        } catch (error) {
            next(error)
        }
    }

    async acceptRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestId = req.params.requestId;
            if (!requestId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
            }

            const request = await this._acceptRequest.execute(requestId)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                request
            })
        } catch (error) {
            next(error)
        }
    }

    async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const requestId = req.params.requestId;
            if (!requestId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
            }

            const request = await this._rejectRequest.execute(requestId)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                request
            })
        } catch (error) {
            next(error)
        }
    }

    async pendingJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const { page = 1, limit = 10, searchTerm = "" } = req.query;
            if (!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return
            }

            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof searchTerm === "string" ? searchTerm : "";

            const { requests, total } = await this._pendingJobs.execute(workshopId, pageNumber, pageSize, searchTermString)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests: requests.map(request => ({
                    name: request.name,
                    requestId: request.requestId,
                    vehicleNo: request.vehicleNo,
                    location: request.location,
                    date: request.createdAt,
                    type: request.type,
                })),
                totaPages: total,
                currentPage: pageNumber
            })
        } catch (error) {
            next(error)
        }
    }

    async updateRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { requestId, status } = req.body;
            if (!requestId || !status) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.DATA_MISSING
                })
                return;
            }
            const request = await this._updateRequestStatus.execute(requestId, status)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                request
            })
        } catch (error) {
            next(error)
        }
    }

    async finishedJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const { page = 1, limit = 10, searchTerm = "" } = req.query;
            if (!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return
            }

            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof searchTerm === "string" ? searchTerm : "";

            const { requests, total } = await this._finishedJobs.execute(workshopId, pageNumber, pageSize, searchTermString)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests: requests.map(request => ({
                    name: request.name,
                    requestId: request.requestId,
                    vehicleNo: request.vehicleNo,
                    location: request.location,
                    date: request.createdAt,
                    type: request.type,
                })),
                totaPages: total,
                currentPage: pageNumber
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllUserRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id;
            if (!customerId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            const page = Number(req.query.page);
            const limitNumber = Number(req.query.limit);
            const skip = (page - 1) / limitNumber

            const { requests, total } = await this._getAllUserRequests.execute(customerId, skip, limitNumber);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests,
                totalRequest: total
            })

        } catch (error) {
            next(error)
        }
    }

    async allAdminRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page, limit, searchTerm } = req.query;
            const pageNumber = Number(page)
            const limitNumber = Number(limit)
            const search = searchTerm?.toString() || ""
            const skip = (pageNumber - 1) * limitNumber;

            const { requests, total } = await this._adminRequests.allRequests(skip, limitNumber, search)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests,
                totalRequests: total
            })

        } catch (error) {
            next(error)
        }
    }
}