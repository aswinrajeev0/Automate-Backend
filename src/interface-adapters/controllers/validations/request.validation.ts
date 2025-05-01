import { z } from "zod";
import { nameSchema } from "../../../shared/validations/name.validation";
import { phoneNumberSchema } from "../../../shared/validations/phone.validation";
import { carBrandSchema, carTypeSchema, descriptionSchema, locationSchema, noteSchema, priceSchema, typeSchema, vehicleNumberSchema } from "../../../shared/validations/request.validation";

export const carLiftRequestValidationSchema = z.object({
    name: nameSchema,
    mobile: phoneNumberSchema,
    carType: carTypeSchema,
    carBrand: carBrandSchema,
    vehicleNo: vehicleNumberSchema,
    type: typeSchema,
    location: locationSchema,
    amount: priceSchema,
    gst: priceSchema
})

export const mobileWorkshopRequestValidationSchema = z.object({
    name: nameSchema,
    mobile: phoneNumberSchema,
    carType: carTypeSchema,
    carBrand: carBrandSchema,
    vehicleNo: vehicleNumberSchema,
    type: typeSchema,
    location: locationSchema,
    description: descriptionSchema,
    notes: noteSchema.optional()
})