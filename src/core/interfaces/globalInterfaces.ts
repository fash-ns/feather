export interface ClassConstructor<Instance = Object> {
  new (props: any, parent: HTMLElement): Instance;
}
