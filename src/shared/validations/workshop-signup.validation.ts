import { z } from "zod";

export const countrySchema = z
  .string()
  .trim()
  .min(2, { message: "Country name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Country must contain only alphabetic characters and spaces",
  });

export const stateSchema = z
  .string()
  .trim()
  .min(2, { message: "State name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "State must contain only alphabetic characters and spaces",
  });

export const citySchema = z
  .string()
  .trim()
  .min(2, { message: "City name must be at least 2 characters long" })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "City must contain only alphabetic characters and spaces",
  });

export const streetAddressSchema = z
  .string()
  .trim()
  .min(5, { message: "Street address must be at least 5 characters long" })
  .max(100, { message: "Street address must not exceed 100 characters" })
  .regex(/^[a-zA-Z0-9\s,.-]+$/, {
    message: "Street address can only contain letters, numbers, spaces, commas, periods, and dashes",
  });

export const buildingNoSchema = z
  .string()
  .trim()
  .min(1, { message: "Building number must be at least 1 character long" })
  .max(10, { message: "Building number must not exceed 10 characters" })
  .regex(/^[a-zA-Z0-9\s-]+$/, {
    message: "Building number can only contain letters, numbers, spaces, and dashes",
  });
