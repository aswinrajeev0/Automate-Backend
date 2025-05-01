import { z } from "zod";

import { strongEmailRegex } from "../../../shared/validations/email.validation";
import { passwordSchema } from "../../../shared/validations/password.validation";
import { nameSchema } from "../../../shared/validations/name.validation";
import { phoneNumberSchema } from "../../../shared/validations/phone.validation";
import { buildingNoSchema, citySchema, countrySchema, stateSchema, streetAddressSchema } from "../../../shared/validations/workshop-signup.validation";

export const workshopSchema = z.object({
    name: nameSchema,
    email: strongEmailRegex,
    phoneNumber: phoneNumberSchema,
    password: passwordSchema,
    country: countrySchema,
    state: stateSchema,
    city: citySchema,
    streetAddress: streetAddressSchema,
    buildingNo: buildingNoSchema
});