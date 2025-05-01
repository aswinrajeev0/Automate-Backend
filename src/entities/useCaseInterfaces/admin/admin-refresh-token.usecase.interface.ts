export interface IRefreshTokenUseCase {
    execute(refreshToken: string | undefined): {role: string, accessToken: string};
}