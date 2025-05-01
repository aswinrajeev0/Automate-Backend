import { ControllerRegistry } from "./controller.registry";
import { RepositoryRegistry } from "./repository.registry";
import { UseCaseRegistry } from "./usecase.registry";

export class DependencyInjection {
    static registerAll(): void {
        ControllerRegistry.registerController();
        RepositoryRegistry.registerRepositories();
        UseCaseRegistry.registerUseCases();
    }
}