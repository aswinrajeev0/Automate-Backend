import { inject, injectable } from "tsyringe";
import { IRefreshTokenUseCase } from "../entities/useCaseInterfaces/admin/admin-refresh-token.usecase.interface";
import { ITokenService } from "../entities/serviceInterfaces.ts/token-service.interface";
import { CustomError } from "../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";
import { JwtPayload } from "jsonwebtoken";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    constructor(
        @inject("ITokenService") private _tokenService: ITokenService
    ){}
    execute(refreshToken: string | undefined): { role: string; accessToken: string; } {
        if(!refreshToken) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.BAD_REQUEST
            )
        }
        const payload = this._tokenService.verifyRefreshToken(refreshToken);
        if(!payload){
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        return {
            role: (payload as JwtPayload).role,
            accessToken: this._tokenService.generateAccessToken({
                id: (payload as JwtPayload).id,
                email: (payload as JwtPayload).email,
                role: (payload as JwtPayload).role
            })
        }
    }
}