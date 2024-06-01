import Service from '../Service';

export interface ServiceConstructor {
  new (...props: any): Service;
}
