import { OAuth2Client } from "google-auth-library";
import { ICustomerRepository } from "../../entities/repositoryInterfaces/customer/customer-repository.interface";
import { IGoogleUseCase } from "../../entities/useCaseInterfaces/customer/googlelogin.usecase.interface";
import { injectable, inject } from "tsyringe";
import { CustomError } from "../../entities/utils/custom.error";
import { HTTP_STATUS } from "../../shared/constants";
import { generateUniqueId } from "../../frameworks/security/uniqueuid.bcrypt";
import { ICustomerEntity } from "../../entities/models/customer.entity";

@injectable()
export class GoogleUseCase implements IGoogleUseCase {
    private _oAuthClient: OAuth2Client;
    constructor(
        @inject("ICustomerRepository") private _customerRepo: ICustomerRepository,
    ) {
        this._oAuthClient = new OAuth2Client();
    }

    async execute(credential: string, client_id: string): Promise<Partial<ICustomerEntity>> {
        const ticket = await this._oAuthClient.verifyIdToken({
            idToken: credential,
            audience: client_id,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new CustomError(
                "Invalid or empty token payload",
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const googleId = payload.sub;
		const email = payload.email;
        const name = payload.given_name;
        const image = payload.picture || "";

        if (!email) {
			throw new CustomError("Email is required", HTTP_STATUS.BAD_REQUEST);
		}

        const existingUser = await this._customerRepo.findByEmail(email);
        if(!existingUser) {
            const customerId = generateUniqueId();
            const newUser = await this._customerRepo.save({
                password: " ",
                customerId,
                googleId,
                email,
                name,
                image
            })

            if(!newUser) {
                throw new CustomError("", 0);
            }
            return newUser;
        }

        return existingUser;    
    }
}