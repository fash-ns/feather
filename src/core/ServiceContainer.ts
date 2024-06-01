/**
 * Dependency injection feature needs a service container in order services to be registered in.
 * This class is the container for services to be registered and retrieved whenever needed.
 * All services are considered singleton. If there's no need for a service to be singleton, It should not be registered inside ServiceContainer
 */
class ServiceContainer {
  /**
   * The container of services separated by service type
   */
  private services = new Map<Object, Object>();

  /**
   * Registers a service
   * @param constructor - The service class constructor
   * @param instance - The instance of service
   */
  public register(constructor: Object, instance: Object) {
    this.services.set(constructor, instance);
  }

  /**
   *
   * @param constructor - The service class constructor.
   * @returns The instance of service.
   * @throws Error if requested service is not registered.
   */
  public retrieve(constructor: Object): Object {
    if (this.services.has(constructor)) return this.services.get(constructor);
    throw new Error(`${constructor} is not registered as a service`);
  }
}

export default ServiceContainer;
