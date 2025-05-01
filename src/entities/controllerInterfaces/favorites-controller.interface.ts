import { NextFunction, Request, Response } from "express";

export interface IFavoritesController {
    handleFavorites(req: Request, res: Response, next: NextFunction): Promise<void>;
    isFavorite(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFavoriteWorkshopsId(req: Request, res: Response, next: NextFunction): Promise<void>;
    getFavoriteWorkshops(req: Request, res: Response, next: NextFunction): Promise<void>
}