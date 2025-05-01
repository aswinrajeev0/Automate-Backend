export interface IGenerateSignatureUseCase {
    execute(): Promise<{ signature: string; timestamp: number }>;
}