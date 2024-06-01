export interface ClassConstructor<Instance = Object> {
  new (props: any): Instance;
}
