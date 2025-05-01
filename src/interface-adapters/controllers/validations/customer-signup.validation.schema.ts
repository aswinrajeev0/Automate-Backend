import { z } from "zod";

import { strongEmailRegex } from "../../../shared/validations/email.validation";
import { passwordSchema } from "../../../shared/validations/password.validation";
import { nameSchema } from "../../../shared/validations/name.validation";
import { phoneNumberSchema } from "../../../shared/validations/phone.validation";

export const customerSchema = z.object({
    name: nameSchema,
    email: strongEmailRegex,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
});