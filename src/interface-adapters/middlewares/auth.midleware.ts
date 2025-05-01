import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, ERROR_MESSAGES } from "../../shared/constants";
import { JWTService } from "../services/jwt-service";
import { JwtPayload } from "jsonwebtoken";
import { CustomError } from "../../entities/utils/custom.error";
import {RedisClient} from "../../frameworks/redis/redisClient";

const client = new RedisClient()

const tokenService = new JWTService()

export interface UserRequest {
    id: string;
    email: string;
    role: "customer" | "workshop" | "admin";
    access_token: string;
    refresh_token: string;
}

export const authenticate =
    (role: "customer" | "workshop" | "admin") =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const accessToken = req.cookies[`${role}_access_token`];
                const refreshToken = req.cookies[`${role}_refresh_token`]

                if (!accessToken) {
                    res.status(HTTP_STATUS.UNAUTHORIZED).json({
                        success: false,
                        message: ERROR_MESSAGES.INVALID_TOKEN,
                    });
                    return;
                }

                const user = tokenService.verifyAccessToken(accessToken)

                if (!user) {
                    throw new CustomError(
                        ERROR_MESSAGES.TOKEN_EXPIRED,
                        HTTP_STATUS.UNAUTHORIZED
                    )
                    // res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    //     message: ERROR_MESSAGES.TOKEN_EXPIRED,
                    // });
                    // return;
                }

                // decoded.access_token = accessToken
                // decoded.refresh_token = refreshToken

                if (typeof user === "object" && "id" in user && "email" in user && "role" in user) {
                    req.user = { ...user as UserRequest, access_token: accessToken, refresh_token: refreshToken };

                    if (req.user.role !== role) {
                        throw new CustomError(
                            ERROR_MESSAGES.FORBIDDEN,
                            HTTP_STATUS.FORBIDDEN
                        )
                    }

                    return next();
                } else {
                    res.status(HTTP_STATUS.FORBIDDEN).json({
                        success: false,
                        message: ERROR_MESSAGES.FORBIDDEN,
                    });
                    return;
                }
            } catch (err: any) {
                next(err)
                // if (err.name === "TokenExpiredError") {
                //     res.status(HTTP_STATUS.UNAUTHORIZED).json({
                //         message: ERROR_MESSAGES.TOKEN_EXPIRED,
                //     });
                //     return;
                // }

                // res.status(HTTP_STATUS.UNAUTHORIZED).json({
                //     success: false,
                //     message: ERROR_MESSAGES.INVALID_TOKEN,
                // });
            }
        };


const isBlacklisted = async (token: string): Promise<boolean> => {
    try {
        const result = await client.isTokenBlackListed(token);
        return result;
    } catch (error) {
        console.error("Redis error:", error);
        return false;
    }
};

export const decodeToken = (role: "customer" | "workshop" | "admin") => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = {
            accessToken: req.cookies[`${role}_access_token`],
            refreshToken: req.cookies[`${role}_refresh_token`]
        }

        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
            });
            return;
        }

        const blacklisted = await isBlacklisted(token.accessToken)

        if (blacklisted) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                message: ERROR_MESSAGES.TOKEN_BLACKLISTED,
            });
            return;
        }

        const user = tokenService.decodeAccessToken(token?.accessToken);
        req.user = {
            id: user?.id,
            email: user?.email,
            role: user?.role,
            access_token: token.accessToken,
            refresh_token: token.refreshToken,
        };
        next();
    } catch (error) {
        next(error)
    }
};