import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/blacklisttoken.usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/revoke-refreshtoken.usecase.interface";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { clearAuthCookies } from "../../shared/utils/cookie-helper";


@injectable()
export class BlockStatusMiddleware {
    constructor(
        @inject("ICustomerRepository") private readonly _customerRepo: ICustomerRepository,
        @inject("IWorkshopRepository") private readonly _workshopRepo: IWorkshopRepository,
        @inject("IBlackListTokenUseCase") private readonly _blacklistTokenUseCase: IBlackListTokenUseCase,
        @inject("IRevokeRefreshTokenUseCase") private readonly _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase
    ) { }

    checkStatus = (role: "customer" | "workshop" | "admin") => async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (req.path.includes("/customer/login")
                || req.path.includes("/workshop/login")
                || req.originalUrl.includes("/public")) {
                next()
                return;
            }
            if (!req.user) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    status: "error",
                    message: "Unauthorized:No user found in request",
                });
                return;
            }

            const { id } = req.user;
            let status: boolean = false;
            if (role === "customer") {
                const user = await this._customerRepo.findById(id);
                if (!user) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({
                        success: false,
                        message: ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                    return;
                }
                status = user.isBlocked as boolean;
            }

            if (role === "workshop") {
                const user = await this._workshopRepo.findById(id);
                if (!user) {
                    res.status(HTTP_STATUS.NOT_FOUND).json({
                        success: false,
                        message: ERROR_MESSAGES.USER_NOT_FOUND,
                    });
                    return;
                }
                status = user.isBlocked as boolean;
            }
            if (status) {
                await this._blacklistTokenUseCase.execute(req.user.access_token);

                await this._revokeRefreshTokenUseCase.execute(req.user.refresh_token);

                const accessTokenName = `${role}_access_token`;
                const refreshTokenName = `${role}_refresh_token`;

                clearAuthCookies(res, accessTokenName, refreshTokenName);
                res.status(HTTP_STATUS.FORBIDDEN).json({
                    success: false,
                    message: "Access denied:Your account has been blocked",
                });
                return
            }
            next();
        } catch (error) {
            console.log("BlocekdStatus MiddleWare has an Error", error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error while checking blocked status"
            })
            return
        }
    };
}