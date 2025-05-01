import { inject, injectable } from "tsyringe";
import { IWorkshopController } from "../../entities/controllerInterfaces/workshop-controller.interface";
import { NextFunction, Request, Response } from "express";
import { IWorkshopSignupUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-signup-usecase.interface";
import { workshopSchema } from "./validations/workshop-signup.validation.schema";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/generatetoken.usecase.interface";
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken } from "../../shared/utils/cookie-helper";
import { IWorkshopLoginUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-login-usecase.interface";
import { IGetAllWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/get-allworkshops-usecase.interface";
import { IUpdateWorkshopStatusUseCase } from "../../entities/useCaseInterfaces/workshop/update-worksho-status-usecase.interface";
import { IResetPasswordOtpUseCase } from "../../entities/useCaseInterfaces/reset-otp.usecase.interface";
import { ITokenService } from "../../entities/serviceInterfaces.ts/token-service.interface";
import { IWorkshopResetPasswordUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-resetPassword-usecase.interface";
import { IWorkshopLogoutUseCase } from "../../entities/useCaseInterfaces/workshop/workshoplogout.usecase.interface";
import { IUpdateWorkshopApprovalStatusUseCase } from "../../entities/useCaseInterfaces/workshop/update-workshop-approvalstatus.usecase.interface";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/admin/admin-refresh-token.usecase.interface";
import { IFeaturedWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/getFeatured-workshops.usecase.interface";
import { IGetWorkshopAddressUseCase } from "../../entities/useCaseInterfaces/workshop/get-workshop-address.usecase.interface";
import { IEditWorkshopUseCase } from "../../entities/useCaseInterfaces/workshop/edit-workshop.usecase.interface";
import { IEditWorkshopAddressUseCase } from "../../entities/useCaseInterfaces/workshop/edit-workshop-address.usecase.interface";
import { passwordSchema } from "../../shared/validations/password.validation";
import { IChangeWorkshopPasswordUseCase } from "../../entities/useCaseInterfaces/workshop/change-password.usecase.interface";
import { IWorkshopDetailsUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-details.usecase.interface";
import { IGetAllWorkshopsWithRatingUseCase } from "../../entities/useCaseInterfaces/workshop/get-all-workshops-with-rating.usecase.interface";
import { IWorkshopDashboardUseCase } from "../../entities/useCaseInterfaces/workshop/workshop-dashboard.usecase.interface";
import { IFavoriteWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/get-favorite-workshops.usecase.interface";

@injectable()
export class WorkshopController implements IWorkshopController {
    constructor(
        @inject("IWorkshopSignupUseCase") private _workshopSignupUseCase: IWorkshopSignupUseCase,
        @inject("IWorkshopLoginUseCase") private _workshopLoginUseCase: IWorkshopLoginUseCase,
        @inject("IGenerateTokenUseCase") private _generateToken: IGenerateTokenUseCase,
        @inject("IGetAllWorkshopsUseCase") private _getAllWorkshopsUseCase: IGetAllWorkshopsUseCase,
        @inject("IUpdateWorkshopStatusUseCase") private _updateWorkshopStatusUseCase: IUpdateWorkshopStatusUseCase,
        @inject("IWorkshopResetPasswordOtpUseCase") private _workshopResetPasswordOtpUseCase: IResetPasswordOtpUseCase,
        @inject("IWorkshopResetPasswordUseCase") private _workshopResetPasswordUseCase: IWorkshopResetPasswordUseCase,
        @inject("ITokenService") private _tokenService: ITokenService,
        @inject("IWorkshopLogoutUseCase") private _workshopLogoutUseCase: IWorkshopLogoutUseCase,
        @inject("IUpdateWorkshopApprovalStatusUseCase") private _updateWorkshopApproval: IUpdateWorkshopApprovalStatusUseCase,
        @inject("IRefreshTokenUseCase") private _refreshToken: IRefreshTokenUseCase,
        @inject("IFeaturedWorkshopsUseCase") private _featuredWorkshops: IFeaturedWorkshopsUseCase,
        @inject("IGetWorkshopAddressUseCase") private _workshopAddress: IGetWorkshopAddressUseCase,
        @inject("IEditWorkshopUseCase") private _editWorkshop: IEditWorkshopUseCase,
        @inject("IEditWorkshopAddressUseCase") private _editWorkshopAddress: IEditWorkshopAddressUseCase,
        @inject("IChangeWorkshopPasswordUseCase") private _changePassword: IChangeWorkshopPasswordUseCase,
        @inject("IWorkshopDetailsUseCase") private _workshopDetails: IWorkshopDetailsUseCase,
        @inject("IGetAllWorkshopsWithRatingUseCase") private _getAllWorkshopWithRating: IGetAllWorkshopsWithRatingUseCase,
        @inject("IWorkshopDashboardUseCase") private _workshopDashboardUseCase: IWorkshopDashboardUseCase,
    ) { }

    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body;
            const schema = workshopSchema
            const validatedData = schema.parse(data)
            await this._workshopSignupUseCase.execute(validatedData)
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
            });
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body
            const workshop = await this._workshopLoginUseCase.execute(data);
            if (!workshop.email || !workshop.id) {
                throw new Error("Workshop id or email is missing.")
            }

            const tokens = await this._generateToken.execute(
                workshop.id,
                workshop.email,
                "workshop"
            )

            const accessTokenName = "workshop_access_token";
            const refreshTokenName = "workshop_refresh_token";

            setAuthCookies(
                res,
                tokens.accessToken,
                tokens.refreshToken,
                accessTokenName,
                refreshTokenName
            )

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
                workshop: {
                    id: workshop.id,
                    name: workshop.name,
                    email: workshop.email,
                    phone: workshop.phone,
                    image: workshop?.image,
                    bio: workshop?.bio,
                    country: workshop.country,
                    state: workshop.state,
                    city: workshop.city,
                    streetAddress: workshop.streetAddress,
                    buildingNo: workshop.buildingNo
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async resetPasswordOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body
            await this._workshopResetPasswordOtpUseCase.execute(email);
            const token = await this._tokenService.generateResetToken(email);
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                success: true,
                token
            })
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token, password, confirmPassword } = req.body;
            await this._workshopResetPasswordUseCase.execute(token, password, confirmPassword)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
                });
                return;
            }

            await this._workshopLogoutUseCase.execute(req.user)
            clearAuthCookies(res, "workshop_access_token", "workshop_refresh_token");

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
            });
        } catch (error) {
            next(error)
        }
    }

    handleRefreshToken(req: Request, res: Response, next: NextFunction): void {
        try {
            const refreshToken = req.user?.refresh_token;
            const newTokens = this._refreshToken.execute(refreshToken);
            const accessTokenName = `${newTokens.role}_access_token`;
            updateCookieWithAccessToken(
                res,
                newTokens.accessToken,
                accessTokenName
            )
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
            });
        } catch (error) {
            clearAuthCookies(
                res,
                `${req.user?.role}_access_token`,
                `${req.user?.role}_refresh_token`
            )
            next(error)
        }
    }

    async getAllWorkshops(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 10, search = "" } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = typeof search === "string" ? search : "";

            const { workshops, total } = await this._getAllWorkshopsUseCase.execute(
                pageNumber,
                pageSize,
                searchTermString
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                workshops: workshops,
                totalPages: total,
                currentPage: pageNumber,
            });
        } catch (error) {
            next(error)
        }
    }

    async updateWorkshopStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { workshopId } = req.params;
            await this._updateWorkshopStatusUseCase.execute(workshopId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    async updateWorkshopApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { workshopId, status, reason } = req.body;
            await this._updateWorkshopApproval.execute(workshopId, status, reason);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }

    async getFeaturedWorkshops(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshops = await this._featuredWorkshops.execute();
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                workshops
            })
        } catch (error) {
            next(error)
        }
    }

    async getWorkshopAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const response = await this._workshopAddress.execute(workshopId)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                address: response
            })
        } catch (error) {
            next(error)
        }
    }

    async updateWorkshop(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const data = req.body
            const workshop = await this._editWorkshop.execute(workshopId, data)
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
                workshop: {
                    name: workshop.name,
                    email: workshop.email,
                    customerId: workshop.workshopId,
                    image: workshop.image,
                    id: workshop.id,
                    phone: workshop.phone,
                    bio: workshop.bio,
                    country: workshop.country,
                    state: workshop.state,
                    city: workshop.city,
                    streetAddress: workshop.streetAddress,
                    buildingNo: workshop.buildingNo
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async editAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
        const workshopId = req.user?.id;
        const data = req.body
        const workshop = await this._editWorkshopAddress.execute(workshopId, data)

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.UPDATE_SUCCESS,
            workshop: {
                name: workshop.name,
                email: workshop.email,
                customerId: workshop.workshopId,
                image: workshop.image,
                id: workshop.id,
                phone: workshop.phone,
                bio: workshop.bio,
                country: workshop.country,
                state: workshop.state,
                city: workshop.city,
                streetAddress: workshop.streetAddress,
                buildingNo: workshop.buildingNo
            }
        })
    }

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id;
            const data = req.body;

            if (!workshopId) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    success: false,
                    message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS
                })
                return;
            }

            if (!data || !data.oldPassword || !data.newPassword || !data.confirmPassword) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.MISSING_PARAMETERS
                })
                return;
            }

            const schema = passwordSchema;
            schema.parse(data.newPassword)

            await this._changePassword.execute(workshopId, data)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESS
            })

        } catch (error) {
            next(error)
        }
    }

    async getWorkshopDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        if (!id) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: ERROR_MESSAGES.ID_NOT_FOUND
            })
            return;
        }

        const { workshop, reviews } = await this._workshopDetails.execute(id)

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.DATA_RETRIEVED,
            workshop,
            reviews: reviews.map((review) => ({
                id: review.reviewId,
                comment: review.comment,
                createdAt: review.createdAt,
                rating: review.rating,
                updatedAt: review.updatedAt,
                userId: review.userId,
                workshopId: review.workshopId
            }))
        })
    }

    async getAllWorkshopsWithRating(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 8, searchQuery = "", sortOption = "" } = req.query;
            const pageNumber = Number(page);
            const pageSize = Number(limit);
            const searchTermString = searchQuery.toString()
            const sort = sortOption.toString()

            const { workshops, total } = await this._getAllWorkshopWithRating.execute(pageNumber, pageSize, searchTermString, sort);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                workshops: workshops,
                totalWorkshops: total,
            });
        } catch (error) {
            next(error)
        }
    }

    async dashBoardData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id as string;
            const dashboardData = await this._workshopDashboardUseCase.dashboardData(workshopId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                dashboardData
            })
        } catch (error) {
            next(error)
        }
    }

    async getGrowthChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id as string;
            const timeFrame = req.query.timeFrame as "week" | "month" | "year";
            if(!timeFrame) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.DATA_MISSING
                })
                return;
            }

            const growthData = await this._workshopDashboardUseCase.getGrowthChartData(workshopId, timeFrame)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                growthData
            })
        } catch (error) {
            next(error)
        }
    }

    async getEarningsChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.user?.id as string;
            const timeFrame = req.query.timeFrame as "week" | "month" | "year";
            if(!timeFrame){
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.DATA_MISSING
                })
                return;
            }

            const earningsData = await this._workshopDashboardUseCase.getEarningsData(workshopId, timeFrame);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                earningsData
            })
        } catch (error) {
            next(error)
        }
    }

}