import { inject, injectable } from "tsyringe";
import { ICancelSlotUseCase } from "../../entities/useCaseInterfaces/bookings/cancel-slot.usecase.interface";
import { IBookingRepository } from "../../entities/repositoryInterfaces/booking/booking-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IBookingModel, IPopulatedId } from "../../frameworks/database/mongoDB/models/booking.model";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";
import { ISlotRepository } from "../../entities/repositoryInterfaces/slots/slot.repository.interface";

@injectable()
export class CancelSlotUseCase implements ICancelSlotUseCase {
    constructor(
        @inject("IBookingRepository") private _bookingRepo: IBookingRepository,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("ITransactionRepository") private _transactionRepo: ITransactionRepository,
        @inject("ISlotRepository") private _slotRepo: ISlotRepository
    ) { }

    async execute(bookingId: string): Promise<IBookingModel> {
        const filter = {
            bookingId
        }
        const booking = await this._bookingRepo.findOneAndUpdate(filter,{status: "cancelled"});
        if (!booking) {
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        await this._slotRepo.findByIdAndUpdate(booking.slotId, {isAvailable: true, isBooked: false})

        const populatedCustomerId = booking.customerId;

        const customerId = (populatedCustomerId as IPopulatedId)._id.toString()

        const wallet = await this._walletRepo.refundUpdate(customerId, booking.amount);
        await this._transactionRepo.save({
            amount: booking.amount,
            description: "Refund",
            transactionId: generateUniqueId("txn"),
            wallet: wallet?._id.toString(),
            type: "credit"
        })

        return booking
    }
}