import { NextFunction, Request, Response } from "express";
import { IAdminController } from "../../entities/controllerInterfaces/admin-controller.interface";
import { injectable, inject } from "tsyringe";
import { IGenerateTokenUseCase } from "../../entities/useCaseInterfaces/generatetoken.usecase.interface";
import { IAdminLoginUseCase } from "../../entities/useCaseInterfaces/admin/admin-login-usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { clearAuthCookies, setAuthCookies, updateCookieWithAccessToken } from "../../shared/utils/cookie-helper";
import { IAdminLogoutUseCase } from "../../entities/useCaseInterfaces/admin/admin-logout.usecase.interface";
import { IRefreshTokenUseCase } from "../../entities/useCaseInterfaces/admin/admin-refresh-token.usecase.interface";
import { IDashboardDataUseCase } from "../../entities/useCaseInterfaces/admin/admin-dashboard-data.usecase.interface";
import { IAdminReportUseCase } from "../../entities/useCaseInterfaces/admin/admin-report.usecase.interface";
import path from "path";
import fs from "fs"

@injectable()
export class AdminController implements IAdminController {
    constructor(
        @inject("IAdminLoginUseCase") private _adminLogin: IAdminLoginUseCase,
        @inject("IGenerateTokenUseCase") private _generateToken: IGenerateTokenUseCase,
        @inject("IAdminLogoutUseCase") private _adminLogoutuseCase: IAdminLogoutUseCase,
        @inject("IRefreshTokenUseCase") private _refreshToken: IRefreshTokenUseCase,
        @inject("IDashboardDataUseCase") private _dashboardData: IDashboardDataUseCase,
        @inject("IAdminReportUseCase") private _adminReportData: IAdminReportUseCase,
    ) { }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data = req.body
            const admin = await this._adminLogin.execute(data);
            if (!admin.email || !admin.id) {
                throw new Error("Admin id or email is missing.")
            }

            const tokens = await this._generateToken.execute(
                admin.id,
                admin.email,
                "admin"
            )

            const accessTokenName = "admin_access_token";
            const refreshTokenName = "admin_refresh_token";

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
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                    image: admin?.image
                }
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

            await this._adminLogoutuseCase.execute(req.user)
            clearAuthCookies(res, "admin_access_token", "admin_refresh_token")
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

    async dashboardData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const dashboardData = await this._dashboardData.dashboardData();
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                dashboardData
            })
        } catch (error) {
            next(error)
        }
    }

    async workshopGrowthData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter = req.query.filter as "monthly" | "yearly";
            if (!filter) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.DATA_MISSING
                })
                return;
            }

            const workshopData = await this._dashboardData.workshopData(filter)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                workshopData
            })

        } catch (error) {
            next(error)
        }
    }

    async reportPageData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reportData = await this._adminReportData.reportData()

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                reportData
            })

        } catch (error) {
            next(error)
        }
    }

    async reportPageRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const startDate = new Date(req.query.startDate as string);
            const endDate = new Date(req.query.endDate as string);
            const limit = Number(req.query.limit);
            const page = Number(req.query.page);
            const skip = (page - 1) * limit;

            const { requests, totalRequests } = await this._adminReportData.allRequests(startDate, endDate, skip, limit)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                requests,
                totalRequests
            })

        } catch (error) {
            next(error)
        }
    }

    async reportPageBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const startDate = new Date(req.query.startDate as string);
            const endDate = new Date(req.query.endDate as string);
            const limit = Number(req.query.limit);
            const page = Number(req.query.page);
            const skip = (page - 1) * limit;

            const { bookings, totalBookings } = await this._adminReportData.allBookings(startDate, endDate, skip, limit)

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

    async reportDownload(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { startDate, endDate, serviceType } = req.query as {
                startDate: string;
                endDate: string;
                serviceType: string;
            };

            const filePath = await this._adminReportData.downloadPdf(startDate, endDate, serviceType);
            const filename = path.basename(filePath);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

            res.sendFile(filePath, (err) => {
                if (err) {
                    next(err);
                } else {
                    fs.unlink(filePath, (unlinkErr) => {
                        if (unlinkErr) console.error("Failed to delete temp PDF:", unlinkErr);
                    });
                }
            });

        } catch (error) {
            next(error)
        }
    }

}