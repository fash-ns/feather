import type PureComponent from './components/PureComponent';
import type { ClassConstructor } from './interfaces/globalInterfaces';
import type { JSXElement } from './interfaces/JSXInterfaces';
import { JSXElementType } from './interfaces/JSXInterfaces';

/**
 * JSX to virtual DOM converter
 */
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
    ...children: Array<JSXElement | string | boolean | Array<JSXElement | string | boolean>>
  ): JSXElement {
    let flatChildren: Array<JSXElement | string> = [];
    children.forEach((child) => {
      if (Array.isArray(child) && typeof child !== 'string')
        flatChildren.push(
          ...(child.filter((item) => typeof item !== 'boolean') as Array<JSXElement | string>),
        );
      else if (typeof child !== 'boolean') flatChildren.push(child);
    });
    flatChildren = flatChildren.filter((child) => typeof child !== 'boolean');

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
