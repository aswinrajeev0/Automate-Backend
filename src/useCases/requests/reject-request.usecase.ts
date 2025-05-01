import { inject, injectable } from "tsyringe";
import { IRejectRequestUSeCase } from "../../entities/useCaseInterfaces/requests/reject-request.usecase.interface";
import { IRequestModel } from "../../frameworks/database/mongoDB/models/request.model";
import { IRequestRepository } from "../../entities/repositoryInterfaces/requests/request-repository.interface";
import { CustomError } from "../../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../../shared/constants";
import { IWalletRepository } from "../../entities/repositoryInterfaces/wallet/wallet.repository.interface";
import { ITransactionRepository } from "../../entities/repositoryInterfaces/wallet/transaction.repository.interface";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";

@injectable()
export class RejectRequestUSeCase implements IRejectRequestUSeCase {
    constructor(
        @inject("IRequestRepository") private _requestRepo: IRequestRepository,
        @inject("IWalletRepository") private _walletRepo: IWalletRepository,
        @inject("ITransactionRepository") private _transactionRepo: ITransactionRepository,
    ){}

    async execute(requestId: string): Promise<IRequestModel> {
        const request = await this._requestRepo.findOneAndUpdate({requestId},{status: "rejected"})
        if(!request) {
            throw new CustomError(
                ERROR_MESSAGES.REQUEST_NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        const customerId = request.customerId.toString();
        console.log(request)

        const wallet = await this._walletRepo.refundUpdate(customerId, request.amount);
        if(!wallet) {
            throw new CustomError(
                ERROR_MESSAGES.NOT_FOUND,
                HTTP_STATUS.NOT_FOUND
            )
        }

        await this._transactionRepo.save({
            amount: request.amount,
            description: "Refund",
            transactionId: generateUniqueId("txn"),
            type: "credit",
            wallet: wallet._id.toString(),
        })

        return request;
    }
}