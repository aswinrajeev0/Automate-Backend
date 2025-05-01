import { inject, injectable } from "tsyringe";
import { IBlackListTokenUseCase } from "../entities/useCaseInterfaces/blacklisttoken.usecase.interface";
import { CustomError } from "../entities/utils/custom.error";
import { ERROR_MESSAGES, HTTP_STATUS } from "../shared/constants";
import { JwtPayload } from "jsonwebtoken";
import { ITokenService } from "../entities/serviceInterfaces.ts/token-service.interface";
import { RedisClient } from "../frameworks/redis/redisClient";

const redisClient = new RedisClient()

@injectable()
export class BlackListTokenUseCase implements IBlackListTokenUseCase {
    constructor(
        @inject("ITokenService") private _tokenService: ITokenService
    ) { }

    async execute(token: string): Promise<void> {
        if (!token) {
            throw new CustomError(
                ERROR_MESSAGES.INVALID_TOKEN,
                HTTP_STATUS.BAD_REQUEST
            )
        }

        const decoded: string | JwtPayload | null =
            this._tokenService.decodeAccessToken(token);
        if (!decoded || typeof decoded === "string" || !decoded.exp) {
            throw new Error("Invalid Token: Missing expiration time");
        }

        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
            await redisClient.blackListToken(token, expiresIn);
        }
    }
}