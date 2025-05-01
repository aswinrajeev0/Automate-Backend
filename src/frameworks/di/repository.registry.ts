import { container } from "tsyringe";

import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { CustomerRepository } from "../../interface-adapters/repositories/customers/customer.repository";
import { IOtpRepository } from "../../entities/repositoryInterfaces/otp-repository.interface";
import { OtpRepository } from "../../interface-adapters/repositories/send-otp.repository";
import { IRefreshTokenRepository } from "../../entities/repositoryInterfaces/refresh-token-repository.interface";
import { RefreshTokenRepository } from "../../interface-adapters/repositories/refresh-token.repository";
import { IWorkshopRepository } from "../../entities/repositoryInterfaces/workshop/workshop-repository.interface";
import { WorkshopRepository } from "../../interface-adapters/repositories/workshop/workshop.repository";
import { IReviewRepository } from "../../entities/repositoryInterfaces/review/review-repository.interface";
import { ReviewRepository } from "../../interface-adapters/repositories/workshop/review-repository";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { BookingRepository } from "../../interface-adapters/repositories/booking/booking.repository";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { RequestRepository } from "../../interface-adapters/repositories/requests/request.repository";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { WalletRepository } from "../../interface-adapters/repositories/wallet/wallet.repository";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { TransactionRepository } from "../../interface-adapters/repositories/wallet/transaction.repository";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";
import { SlotRepository } from "../../interface-adapters/repositories/slots/slot.repository";
import { IChatRepository } from "../../entities/repositoryInterfaces/chat/chat-repository.interface";
import { ChatRepository } from "../../interface-adapters/repositories/chat/chat.repository";
import { IFavoritesRepository } from "../../entities/repositoryInterfaces/favorites/favorites.repository.interface";
import { FavoritesRepository } from "../../interface-adapters/repositories/favorites/favorites.repository";

export class RepositoryRegistry {
    static registerRepositories(): void {
        container.register<ICustomerRepository>("ICustomerRepository", {
            useClass: CustomerRepository
        })

        container.register<IOtpRepository>("IOtpRepository", {
            useClass: OtpRepository
        })

        container.register<IRefreshTokenRepository>("IRefreshTokenRepository", {
            useClass: RefreshTokenRepository
        })

        container.register<IWorkshopRepository>("IWorkshopRepository", {
            useClass: WorkshopRepository
        })

        container.register<IReviewRepository>("IReviewRepository", {
            useClass: ReviewRepository
        })

        container.register<IBookingRepository>("IBookingRepository", {
            useClass: BookingRepository
        })

        container.register<IRequestRepository>("IRequestRepository", {
            useClass: RequestRepository
        })

        container.register<IWalletRepository>("IWalletRepository", {
            useClass: WalletRepository
        })

        container.register<ITransactionRepository>("ITransactionRepository", {
            useClass: TransactionRepository
        })

        container.register<ISlotRepository>("ISlotRepository", {
            useClass: SlotRepository
        })

        container.register<IChatRepository>("IChatRepository", {
            useClass: ChatRepository
        })

        container.register<IFavoritesRepository>("IFavoritesRepository", {
            useClass: FavoritesRepository
        })
    }
}