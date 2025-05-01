import { inject, injectable } from "tsyringe";
import { IAuthController } from "../../entities/controllerInterfaces/auth-controller.interface";
import { Request, Response, NextFunction } from "express";
import { IGenerateSignatureUseCase } from "../../entities/useCaseInterfaces/auth/generate-signature.usecase.interface";
import { HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";


@injectable()
export class AuthController implements IAuthController {

    constructor(
        @inject("IGenerateSignatureUseCase") private _generateSignatureUseCase: IGenerateSignatureUseCase
    ) { }

    async generateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { signature, timestamp } = await this._generateSignatureUseCase.execute()
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: SUCCESS_MESSAGES.CREATED,
                signature,
                timestamp
            })
        } catch (error) {
            next(error)
        }
    }

}