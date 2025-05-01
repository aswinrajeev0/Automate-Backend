import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { CustomError } from "../../entities/utils/custom.error";
import logger from "../../shared/utils/error-logger";
import { error } from "console";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let message: string = ERROR_MESSAGES.SERVER_ERROR;
    let errors: any[] | null = null;

    if (err instanceof ZodError) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        message = ERROR_MESSAGES.VALIDATION_ERROR;
        errors = err.errors.map(error => ({
            field: error.path.join("."),
            message: error.message
        }));
    } else if (err instanceof CustomError) {
        statusCode = err.statusCode;
        message = err.message;
    } else {
        console.error("Unhandled Error:", err);
        if (err.name === "TokenExpiredError") {
            statusCode = HTTP_STATUS.UNAUTHORIZED
            message = ERROR_MESSAGES.TOKEN_EXPIRED
        }
    }
    logger.error(`[${req.method}] ${req.url} - ${err.message}`, { stack: err.stack });
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors,
    });
};
