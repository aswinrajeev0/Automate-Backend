import { injectable, inject } from "tsyringe";
import { ICustomerLogutUseCase } from "../../entities/useCaseInterfaces/customer/customer-logout.interface";
import { UserRequest } from "../../interface-adapters/middlewares/auth.midleware";
import { IBlackListTokenUseCase } from "../../entities/useCaseInterfaces/blacklisttoken.usecase.interface";
import { IRevokeRefreshTokenUseCase } from "../../entities/useCaseInterfaces/revoke-refreshtoken.usecase.interface";
import { clearAuthCookies } from "../../shared/utils/cookie-helper";

@injectable()
export class CustomerLogutUseCase implements ICustomerLogutUseCase {
    constructor(
        @inject("IBlackListTokenUseCase") private _blackListTokenUseCase: IBlackListTokenUseCase,
        @inject("IRevokeRefreshTokenUseCase") private _revokeRefreshToken: IRevokeRefreshTokenUseCase
    ) { }

    async execute(user: UserRequest): Promise<void> {
        await this._blackListTokenUseCase.execute(user.access_token);
        await this._revokeRefreshToken.execute(user.refresh_token);
    }
}