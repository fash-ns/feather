import Service from './Service';

class DependencyContainer {
  private services = new Map<typeof Service, Service>();

  public register(constructor: typeof Service, instance: Service) {
    this.services.set(constructor, instance);
  }

  public retrieve(constructor: typeof Service): Service {
    if (this.services.has(constructor)) return this.services.get(constructor);
    throw new Error(`${constructor} is not registered as a service`);
  }
}

export default DependencyContainer;
