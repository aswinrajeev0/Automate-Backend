import { z } from "zod";
import { strongEmailRegex } from "../../../shared/validations/email.validation";

export const otpMailValidation = z.object({
    email: strongEmailRegex,
    otp: z.string()
        .length(6, "Otp must be exactly 6 digits.")
        .regex(/^\d{6}$/, "OTP must contain only numbers")
})