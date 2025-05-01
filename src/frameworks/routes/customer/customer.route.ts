import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../base.route";
import {
    blockStatusMiddleware,
    bookingController,
    chatController,
    customerController,
    favoritesController,
    otpController,
    paymentController,
    requestController,
    reviewController,
    slotController,
    walletController,
} from "../../di/resolver";
import { authenticate, decodeToken } from "../../../interface-adapters/middlewares/auth.midleware";

export class CustomerRoute extends BaseRoute {
    constructor() {
        super();
    }

    protected initializeRoute(): void {

        this.router.use(decodeToken("customer"))
        // this.router.use(blockStatusMiddleware.checkStatus("customer"))

        this.router.post('/sign-up', (req: Request, res: Response, next: NextFunction) => {
            customerController.signup(req, res, next);
        })

        this.router.post('/send-otp', (req: Request, res: Response, next: NextFunction) => {
            otpController.sendOtp(req, res, next);
        })

        this.router.post('/verify-otp', (req: Request, res: Response, next: NextFunction) => {
            otpController.verifyOtp(req, res, next);
        })

        this.router.post('/login', (req: Request, res: Response, next: NextFunction) => {
            customerController.login(req, res, next);
        })

        this.router.post("/reset-password-otp", (req: Request, res: Response, next: NextFunction) => {
            customerController.resetPasswordOtp(req, res, next);
        })

        this.router.patch("/reset-password", (req: Request, res: Response, next: NextFunction) => {
            customerController.resetPassword(req, res, next);
        })

        this.router.post("/logout", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.logout(req, res, next);
        })

        this.router.post("/google-auth", (req: Request, res: Response, next: NextFunction) => {
            customerController.googleAuth(req, res, next);
        })

        this.router.post("/refresh-token", decodeToken("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.handleRefreshToken(req, res, next)
        })

        this.router.put("/update-customer", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.editCustomer(req, res, next)
        })

        this.router.delete("/delete-customer", decodeToken("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.deleteCustomer(req, res, next)
        })

        this.router.get("/customer-address", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.getCustomerAddress(req, res, next)
        })

        this.router.put("/edit-address", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.editAddress(req, res, next)
        })

        this.router.patch("/change-password", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            customerController.changePassword(req, res, next)
        })

        this.router.post("/submit-review", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            reviewController.submitReview(req, res, next)
        })

        this.router.get("/booked-slots/:workshopId", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getBookedSlots(req, res, next)
        })

        this.router.post("/book-slot", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.bookSlot(req, res, next);
        })

        this.router.post("/car-lift", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            requestController.carLift(req, res, next)
        })

        this.router.post("/mobile-workshop", authenticate("customer"), blockStatusMiddleware.checkStatus("customer"), (req: Request, res: Response, next: NextFunction) => {
            requestController.mobileWorkshop(req, res, next)
        })

        this.router.patch("/cancel-slot/:bookingId", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.cancelslot(req, res, next)
        })

        this.router.post("/create-order", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            paymentController.createOrder(req, res, next)
        })

        this.router.post("/verify-payment", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            paymentController.verifyPayment(req, res, next)
        })

        this.router.get("/wallet", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            walletController.getWallet(req, res, next);
        })

        this.router.post("/add-money", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            walletController.addMoney(req, res, next);
        })

        this.router.post("/wallet-purchase", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            walletController.walletPurchase(req, res, next);
        })

        this.router.get("/get-all-requests", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            requestController.getAllUserRequests(req, res, next);
        })

        this.router.get("/is-slot-available", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.isSlotAvailable(req, res, next)
        })

        this.router.get("/all-user-bookings", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            bookingController.getAllCustomerBookings(req, res, next)
        })

        this.router.get("/fetch-available-slots", authenticate("customer"), (req: Request, res:Response, next: NextFunction) => {
            slotController.fetchAvailableSlots(req, res, next);
        })

        this.router.get("/available-dates", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            slotController.fetchAvailableDates(req, res, next);
        })

        this.router.post("/save-slot-id", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            slotController.saveSlotId(req, res, next);
        })

        this.router.get("/check-slot-availability", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            slotController.checkSlotAvailability(req, res, next)
        })

        this.router.get("/get-conversations", authenticate("customer"), (req, res, next) => {
            chatController.getConversations(req, res, next)
        })

        this.router.get("/fallback-users", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            chatController.fallBackUsers(req, res, next);
        })

        this.router.post("/chat/start", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            chatController.startChat(req, res, next);
        })

        this.router.get("/chat/messages", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            chatController.getMessages(req, res, next);
        })

        this.router.post("/handle-favorites", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            favoritesController.handleFavorites(req, res, next);
        })

        this.router.get("/favorites", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            favoritesController.getFavoriteWorkshops(req, res, next);
        })

        this.router.get("/is-favorite", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            favoritesController.isFavorite(req, res, next);
        })

        this.router.get("/favorite-workshop-ids", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            favoritesController.getFavoriteWorkshopsId(req, res, next);
        })

        this.router.patch("/chat/messages/mark-read", authenticate("customer"), (req: Request, res: Response, next: NextFunction) => {
            chatController.markMessagesAsRead(req, res, next);
        })
    }
}