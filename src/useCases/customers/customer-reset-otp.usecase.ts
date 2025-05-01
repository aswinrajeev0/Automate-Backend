import { inject, injectable } from "tsyringe";
import { IResetPasswordOtpUseCase } from "../../entities/useCaseInterfaces/reset-otp.usecase.interface";
import { IEmailService } from "../../entities/serviceInterfaces.ts/email-service.interface";
import { IOtpService } from "../../entities/serviceInterfaces.ts/otp-service.interface";
import { IBcrypt } from "../../frameworks/security/bcrypt.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";

@injectable()
export class CustomerResetPasswordOtpUseCase implements IResetPasswordOtpUseCase {
    constructor(
        @inject("IEmailService") private _emailService: IEmailService,
        @inject("IOtpService") private _otpService: IOtpService,
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
        @inject("IOtpBcrypt") private _otpBcrypt: IBcrypt
    ) { }

    async execute(email: string): Promise<void> {
        const emailExists = await this._customerRepo.findByEmail(email)
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