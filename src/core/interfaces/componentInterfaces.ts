import type Engine from '../Engine';
import type { JSXElement } from './JSXInterfaces';

/**
 * @public
 * Default component props
 */
export interface ComponentProps {
  children?: (string | JSXElement)[];
  engine?: Engine;
}
