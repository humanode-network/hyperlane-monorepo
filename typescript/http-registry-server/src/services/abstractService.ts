import { IRegistry } from '@humanode-hyperlane/registry';

import { RegistryService } from './registryService.js';

export abstract class AbstractService {
  constructor(protected readonly registryService: RegistryService) {}

  protected async withRegistry<T>(
    operation: (registry: IRegistry) => Promise<T>,
  ): Promise<T> {
    return this.registryService.withRegistry(operation);
  }
}
