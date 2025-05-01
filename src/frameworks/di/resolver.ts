import { container } from "tsyringe";
import { DependencyInjection } from ".";

import { AdminController } from "../../interface-adapters/controllers/admin.controller"
import { CustomerController } from "../../interface-adapters/controllers/customer.controller";
import { WorkshopController } from "../../interface-adapters/controllers/workshop.controller";
import { OtpController } from "../../interface-adapters/controllers/otp.controller";
import { AuthController } from "../../interface-adapters/controllers/auth.controller";
import { ReviewController } from "../../interface-adapters/controllers/review.controller";
import { BookingController } from "../../interface-adapters/controllers/booking.controller";
import { RequestController } from "../../interface-adapters/controllers/request.controller";
import { BlockStatusMiddleware } from "../../interface-adapters/middlewares/block-status.middleware";
import { HealthController } from "../../interface-adapters/controllers/health.controller";
import { PaymentController } from "../../interface-adapters/controllers/payment.controller";
import { WalletController } from "../../interface-adapters/controllers/wallet.controller";
import { SlotController } from "../../interface-adapters/controllers/slot.controller";
import { ChatController } from "../../interface-adapters/controllers/chat.controller";
import { FavoritesController } from "../../interface-adapters/controllers/favorites.controller";

DependencyInjection.registerAll();

export const otpController = container.resolve(OtpController)
export const adminController = container.resolve(AdminController);
export const customerController = container.resolve(CustomerController)
export const workshopController = container.resolve(WorkshopController)
export const authController = container.resolve(AuthController);
export const reviewController = container.resolve(ReviewController);
export const bookingController = container.resolve(BookingController);
export const requestController = container.resolve(RequestController);
export const paymentController = container.resolve(PaymentController);
export const walletController = container.resolve(WalletController);
export const slotController = container.resolve(SlotController);
export const chatController = container.resolve(ChatController);
export const favoritesController = container.resolve(FavoritesController)

export const healthController = container.resolve(HealthController);

export const blockStatusMiddleware = container.resolve(BlockStatusMiddleware);
