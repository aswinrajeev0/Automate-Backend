
export interface IUserEntity {
    id?: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    image?: string;
    isAdmin?: Boolean;
    isBlocked: Boolean;
    createdAt: Date;
    updatedAt: Date;
}