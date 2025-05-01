import { Request } from "express";
import { UserRequest } from "../interface-adapters/middlewares/auth.midleware";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserRequest;
    }
}



// {
//             id: string;
//             email: string;
//             role: "customer" | "workshop" | "admin";
//             access_token: string,
//             refresh_token: string
//         }