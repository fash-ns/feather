import type PureComponent from './components/PureComponent';
import type { ClassConstructor } from './interfaces/globalInterfaces';
import { JSXElement, JSXElementType } from './interfaces/JSXInterfaces';

class JSXFacade {
  /**
   * Turns JSX syntax to pure JSXElement objects.
   * @param element - name of the element. could be string (For native DOM elements) or an instance of a class which is inherited from PureComponent
   * @param props - element props
   * @param children - element children
   * @returns formatted JSXElement.
   */
  public static createElement(
    element: string | ClassConstructor<PureComponent>,
    props: Record<string, any>,
    ...children: Array<JSXElement | string>
  ): JSXElement {
    const flatChildren: Array<JSXElement | string> = [];
    children.forEach((child) => {
      if (Array.isArray(child) && typeof child !== 'string') flatChildren.push(...child);
      else flatChildren.push(child);
    });
    if (typeof element === 'string')
      return {
        type: JSXElementType.Element,
        tag: element,
        props,
        children: flatChildren,
      };

    return {
      type: JSXElementType.Component,
      tag: element,
      props,
      children: flatChildren,
    };
  }
}

export default JSXFacade;
