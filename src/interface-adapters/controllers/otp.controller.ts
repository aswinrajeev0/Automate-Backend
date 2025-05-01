import { Request, Response, NextFunction } from "express";
import { IOtpController } from "../../entities/controllerInterfaces/otp-controller.interface";
import { inject, injectable } from "tsyringe";
import { ISendOtpUseCase } from "../../entities/useCaseInterfaces/auth/send-otp-usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IVerifyOtpUseCase } from "../../entities/useCaseInterfaces/auth/verify-otp-usecase.interface";
import { otpMailValidation } from "./validations/otp-mail.validation";

@injectable()
export class OtpController implements IOtpController {
    constructor(
        @inject("ISendOtpUseCase") private _sendOtpUseCase: ISendOtpUseCase,
        @inject("IVerifyOtpUseCase") private _verifyOtpUsease: IVerifyOtpUseCase
    ) { }

    async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            await this._sendOtpUseCase.execute(email);
            res.status(HTTP_STATUS.OK).json({
                message: SUCCESS_MESSAGES.OTP_SEND_SUCCESS,
                success: true
            });
        } catch (error) {
            next(error)
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            const validatedData = otpMailValidation.parse({ email, otp })
            await this._verifyOtpUsease.execute(validatedData);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.VERIFICATION_SUCCESS
            })
        } catch (error) {
            next(error)
        }
    }
}
