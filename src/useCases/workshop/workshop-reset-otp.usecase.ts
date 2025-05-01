import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { IEmailService } from "../../entities/serviceInterfaces.ts/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces.ts/otp-service.interface";
import { IResetPasswordOtpUseCase } from "../../entities/useCaseInterfaces/reset-otp.usecase.interface";
import { inject, injectable } from "tsyringe";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";

@injectable()
export class WorkshopResetPasswordOtpUseCase implements IResetPasswordOtpUseCase {
    constructor(
        @inject("IEmailService") private _emailService: IEmailService,
        @inject("IOtpService") private _otpService: IOtpService,
        @inject("IWorkshopRepository") private _workshopRepo: IWorkshopRepository,
        @inject("IOtpBcrypt") private _otpBcrypt: IBcrypt
    ) { }

    async execute(email: string): Promise<void> {
        const emailExists = await this._workshopRepo.findByEmail(email)
        if (!emailExists) {
            throw new CustomError(
                ERROR_MESSAGES.EMAIL_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            );
        }

        const otp = this._otpService.generateOtp();
        console.log(`OTP: ${otp}`);
        const hashOtp = await this._otpBcrypt.hash(otp);
        await this._otpService.storeOtp(email, hashOtp);
        await this._emailService.sendOtpEmail(
            email,
            "AutoMate - Verify your reset password email.",
            otp
        )
    }
}