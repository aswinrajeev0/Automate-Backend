import { NextFunction, Request, Response } from "express";
import { BaseRoute } from "../base.route";
import { blockStatusMiddleware, bookingController, chatController, otpController, requestController, reviewController, slotController, workshopController } from "../../di/resolver";
import { authenticate, decodeToken } from "../../../interface-adapters/middlewares/auth.midleware";

export class WorkshopRoute extends BaseRoute {
    constructor() {
        super();
    }

    protected initializeRoute(): void {
        this.router.post("/sign-up", (req, res, next) => {
            workshopController.signup(req, res, next);
        });

        this.router.post("/send-otp", (req, res, next) => {
            otpController.sendOtp(req, res, next);
        });

        this.router.post("/verify-otp", (req, res, next) => {
            otpController.verifyOtp(req, res, next);
        });

        this.router.post("/login", (req, res, next) => {
            workshopController.login(req, res, next);
        });

        this.router.post("/reset-password-otp", (req, res, next) => {
            workshopController.resetPasswordOtp(req, res, next);
        });

        this.router.patch("/reset-password", (req, res, next) => {
            workshopController.resetPassword(req, res, next);
        });

        // Apply authentication & block status check to all routes below
        this.router.use(authenticate("workshop"));
        this.router.use(blockStatusMiddleware.checkStatus("workshop"));

        this.router.post("/logout", (req, res, next) => {
            workshopController.logout(req, res, next);
        });

        this.router.post("/refresh-token", decodeToken("workshop"), (req, res, next) => {
            workshopController.handleRefreshToken(req, res, next);
        });

        this.router.get("/workshop-address", (req, res, next) => {
            workshopController.getWorkshopAddress(req, res, next);
        });

        this.router.put("/update-workshop", (req, res, next) => {
            workshopController.updateWorkshop(req, res, next);
        });

        this.router.put("/edit-address", (req, res, next) => {
            workshopController.editAddress(req, res, next);
        });

        this.router.patch("/change-password", (req, res, next) => {
            workshopController.changePassword(req, res, next);
        });

        this.router.get("/all-pending-requests", (req, res, next) => {
            requestController.allPendingRequests(req, res, next);
        });

        this.router.get("/request-details/:requestId", (req, res, next) => {
            requestController.requestDetails(req, res, next);
        });

        this.router.patch("/accept-request/:requestId", (req, res, next) => {
            requestController.acceptRequest(req, res, next);
        });

        this.router.patch("/reject-request/:requestId", (req, res, next) => {
            requestController.rejectRequest(req, res, next);
        });

        this.router.get("/pending-jobs", (req, res, next) => {
            requestController.pendingJobs(req, res, next);
        });

        this.router.patch("/update-request-status", (req, res, next) => {
            requestController.updateRequestStatus(req, res, next);
        });

        this.router.get("/workshop-reviews", (req, res, next) => {
            reviewController.getWorkshopReviews(req, res, next);
        });

        this.router.get("/finished-jobs", (req, res, next) => {
            requestController.finishedJobs(req, res, next)
        })

        this.router.get("/all-workshop-bookings", (req, res, next) => {
            bookingController.getAllWorkshopBookings(req, res, next)
        })

        this.router.patch("/cancel-booking", (req, res, next) => {
            bookingController.cancelBooking(req, res, next)
        })

        this.router.patch("/change-booking-status", (req, res, next) => {
            bookingController.changeStatus(req, res, next)
        })

        this.router.get("/all-slots", (req, res, next) => {
            slotController.getSlots(req, res, next);
        })

        this.router.post("/create-slots", (req, res, next) => {
            slotController.createSlots(req, res, next)
        })

        this.router.delete("/delete-slot", (req, res, next) => {
            slotController.deleteSlot(req, res, next);
        })

        this.router.patch("/toggle-slot-availabilty", (req, res, next) => {
            slotController.toggleAvailableSlots(req, res, next);
        })

        this.router.get("/get-conversations", (req, res, next) => {
            chatController.getConversations(req, res, next);
        })

        this.router.get("/fallback-user", (req, res, next) => {
            chatController.fallBackUsers(req, res, next);
        })

        this.router.post("/chat/start", (req, res, next) => {
            chatController.startChat(req, res, next);
        })

        this.router.get("/dashboard", (req, res, next) => {
            workshopController.dashBoardData(req, res, next);
        })

        this.router.get("/growth-chart-data", (req, res, next) => {
            workshopController.getGrowthChartData(req, res, next);
        })

        this.router.get("/earnings-chart-data", (req, res, next) => {
            workshopController.getEarningsChartData(req, res, next);
        })

        this.router.get("/chat/messages", (req, res, next) => {
            chatController.getMessages(req, res, next);
        })

        this.router.patch("/chat/messages/mark-read", (req, res, next) => {
            chatController.markMessagesAsRead(req, res, next);
        })
    }
}
