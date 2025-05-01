import { container } from "tsyringe";
import { AdminController } from "../../interface-adapters/controllers/admin.controller";
import { CustomerController } from "../../interface-adapters/controllers/customer.controller";
import { WorkshopController } from "../../interface-adapters/controllers/workshop.controller";
import { OtpController } from "../../interface-adapters/controllers/otp.controller";
import { ReviewController } from "../../interface-adapters/controllers/review.controller";

export class ControllerRegistry {
    static registerController(): void {

        container.register("AdminController", {
            useClass: AdminController
        })

        container.register("CustomerController", {
            useClass: CustomerController
        })

        container.register("WorkshopController", {
            useClass: WorkshopController
        })
        
        container.register("OtpController", {
            useClass: OtpController
        })

        container.register("ReviewController", {
            useClass: ReviewController
        })
    }
}