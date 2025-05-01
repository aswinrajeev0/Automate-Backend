import { z } from "zod";

export const vehicleNumberSchema = z
    .string()
    .trim()
    .min(5, { message: "Vehicle number should be at least 5 characters long" })
    .max(8, { message: "Vehicle number should not exceed 8 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, {
        message: "Vehicle number should only have letters and numbers"
    })

export const carTypeSchema = z
    .string()
    .trim()
    .min(3, { message: "Car type must be specified" })

export const carBrandSchema = z
    .string()
    .trim()
    .min(2, { message: "Car brand must be specified" })

export const locationSchema = z
    .string()
    .trim()
    .min(5, { message: "Location must be specified" })

export const typeSchema = z
    .enum(["car-lift", "mobile-workshop"])

export const descriptionSchema = z
    .string()
    .trim()
    .min(10, { message: "The description must atleast 10 characters" })

export const noteSchema = z
    .string()

export const priceSchema = z
    .number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number"
    })
    .positive("Price must be greater than 0")
    .refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: "Price can have up to 2 decimal places"
    });