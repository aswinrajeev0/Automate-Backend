import { inject, injectable } from "tsyringe";
import { IFavoritesController } from "../../entities/controllerInterfaces/favorites-controller.interface";
import { Request, Response, NextFunction } from "express";
import { IHandelFavoritesUseCase } from "../../entities/useCaseInterfaces/favorites/handle-favorites.usecase.interface";
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../../shared/constants";
import { IFavoriteWorkshopsUseCase } from "../../entities/useCaseInterfaces/workshop/get-favorite-workshops.usecase.interface";

@injectable()
export class FavoritesController implements IFavoritesController {
    constructor(
        @inject("IHandelFavoritesUseCase") private _handleFavorite: IHandelFavoritesUseCase,
        @inject("IFavoriteWorkshopsUseCase") private _favoriteWorkshops: IFavoriteWorkshopsUseCase,
    ) { }

    async handleFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id as string;
            const workshopId = req.body.workshopId as string;
            const status = req.body.status as string
            if (!workshopId || !status) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    success: false,
                    message: ERROR_MESSAGES.ID_NOT_FOUND
                })
                return;
            }

            let message: string;

            if (status === "add-to-favorites") {
                await this._handleFavorite.addToFavorites(customerId, workshopId);
                message = SUCCESS_MESSAGES.ADDED_TO_FAVORITES;
            } else if(status === "remove-from-favorites") {
                await this._handleFavorite.removeFromFavorites(customerId, workshopId);
                message = SUCCESS_MESSAGES.REMOVED_FROM_FAVORITES;
            }else{
                message = ERROR_MESSAGES.INVALID_STATUS
            }

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message
            })

        } catch (error) {
            next(error)
        }
    }

    async isFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const workshopId = req.query.workshopId as string;
            const customerId = req.user?.id as string;

            const isFavorite = await this._handleFavorite.isWorkshopFavorite(customerId, workshopId);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                isFavorite
            })

        } catch (error) {
            next(error)
        }
    }

    async getFavoriteWorkshopsId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const customerId = req.user?.id as string;
            const favoriteWorkshopIds = await this._handleFavorite.getFavoriteWorkshopsId(customerId);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                favoriteWorkshopIds
            })
        } catch (error) {
            next(error)
        }
    }

    async getFavoriteWorkshops(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {page, limit} = req.query;
            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const customerId = req.user?.id as string;

            const {workshops, total} = await this._favoriteWorkshops.execute(customerId, pageNumber, limitNumber)

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: SUCCESS_MESSAGES.DATA_RETRIEVED,
                workshops,
                total
            })
        } catch (error) {
            next(error)
        }
    }
}