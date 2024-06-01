/**
 * type of Component constructor.
 *
 * @example
 * Consider we have a class component called TestComponent. We also have an instance of it
 * which is hold inside the testComponent variable:
 * ```
 * const testComponent = new TestComponent({});
 * ```
 * In this case, TestComponent itself is a ClassConstructor and testComponent is an instance of TestComponent.
 */
export interface ClassConstructor<Instance = Object> {
  new (props: any): Instance;
}
