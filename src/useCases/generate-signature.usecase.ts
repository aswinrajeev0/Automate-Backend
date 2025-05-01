import { injectable } from "tsyringe";
import { IGenerateSignatureUseCase } from "../entities/useCaseInterfaces/auth/generate-signature.usecase.interface";
import crypto from "crypto"
import { config } from "../shared/config";
import Cloudinary from 'cloudinary'

const cloudinary = Cloudinary.v2

@injectable()
export class GenerateSignatureUseCase implements IGenerateSignatureUseCase {
    async execute(): Promise<{ signature: string; timestamp: number; }> {
        return new Promise((resolve) => {
            const timestamp = Math.round(new Date().getTime() / 1000);
            const apiSecret = config.cloudinary.SECRET_KEY as string;
            const uploadPreset = config.cloudinary.UPLOAD_PRESET as string
            console.log(uploadPreset)
            const stringToSign = `timestamp=${timestamp}&upload_preset=${uploadPreset}`;

            const signature = crypto
                .createHmac("sha256", apiSecret)
                .update(stringToSign)
                .digest("hex");

            resolve({ signature, timestamp });
        });
    }
}