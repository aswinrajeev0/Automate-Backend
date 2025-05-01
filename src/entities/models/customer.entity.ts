import { IUserEntity } from "./user.entity";

export interface ICustomerEntity extends IUserEntity {
    customerId: string;
    googleId: string;
    bio?: string;
    country?: string;
    state?: string;
    city?: string;
    streetAddress?: string;
    buildingNo?: string;
}