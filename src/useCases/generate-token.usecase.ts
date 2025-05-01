import { inject, injectable } from "tsyringe";
import { IGenerateTokenUseCase } from "../entities/useCaseInterfaces/generatetoken.usecase.interface";
import { ITokenService } from "../entities/serviceInterfaces.ts/token-service.interface";
import { IRefreshTokenRepository } from "../entities/repositoryInterfaces/refresh-token-repository.interface";
import { TRole } from "../shared/constants";

@injectable()
export class GenerateTokenUseCase implements IGenerateTokenUseCase {
    constructor(
        @inject("ITokenService") private _tokenService: ITokenService,
        @inject("IRefreshTokenRepository") private _refreshTokenRepo: IRefreshTokenRepository
    ) { }

    async execute(id: string, email: string, role: string): Promise<{ accessToken: string; refreshToken: string; }> {
        const payload = {id, email, role}

        const accessToken = this._tokenService.generateAccessToken(payload);
        const refreshToken = this._tokenService.generateRefreshToken(payload);

        await this._refreshTokenRepo.save({
            token: refreshToken,
            userType: role as TRole,
            user: id,
            expiresAt: Date.now() + 7 * 24 * 60 * 1000
        });

        return {
            accessToken,
            refreshToken
        }
    }
}