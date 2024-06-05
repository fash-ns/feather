import PureComponent from './components/PureComponent';
import PropsFacade from './dom-utils/PropsFacade';
import { ClassConstructor } from './interfaces/globalInterfaces';
import type { JSXElement } from './interfaces/JSXInterfaces';
import { JSXElementType } from './interfaces/JSXInterfaces';
import ServiceContainer from './ServiceContainer';

/**
 * Beating heart of the application! The whole functionality of the framework starts from this class.
 *
 */
class Engine {
  /**
   * Instance of Service container in order to register dependencies.
   */
  private di: ServiceContainer;

  public constructor() {
    this.di = new ServiceContainer();
  }

  /**
   * Registers a service
   * @param constructor - Class constructor of a service
   */
  public registerService(services: any[]) {
    for (const constructor of services) {
      this.di.register(constructor, new constructor());
    }
  }

  /**
   * Retrieves a service
   * @param constructor - Class constructor of a service
   * @returns The requested service if it's been registered.
   * @throws Error if the service has not been registered
   */
  public getService<T>(constructor: Object): T {
    return this.di.retrieve(constructor) as T;
  }

  /**
   * Application should be started by providing a main component. This method renders the main component
   * @param element - Main component
   * @param container - An element developer wants the app to be rendered in
   */
  public renderRoot(Element: ClassConstructor<PureComponent>, container: HTMLElement) {
    const instance = new Element({ engine: this });
    const nativeElement = instance.createDomElement();
    const shadowContainer = container.attachShadow({ mode: 'closed' });
    shadowContainer.appendChild(nativeElement);
  }

  /**
   * Creates element according to its type.
   * @param element - JSXElement (for HTMLElements and components) or string (for TextNodes)
   * @returns created TextNode or HTMLElement
   */
  public createDomElement(element: JSXElement | string): Text | HTMLElement {
    if (typeof element === 'string') {
      const textElement = document.createTextNode(element);
      return textElement;
    }

    if (element.type === JSXElementType.Element) {
      const nativeElement = document.createElement(element.tag);
      if (element.props) PropsFacade.setElementAttributes(nativeElement, element.props);

      if (element.children) {
        element.children.forEach((child) => {
          this.appendDomAsChildren(nativeElement, child);
        });
      }
      return nativeElement;
    }
    if (element.type === JSXElementType.Component) {
      const component = new element.tag({
        ...element.props,
        children: element.children,
        engine: this,
      });
      const nativeElement = component.createDomElement();
      element.instance = component;
      return nativeElement;
    } else
      throw new Error(
        `Unknown type provided as element. provided ${element}
         (${typeof element}) Which is neither JSXElement nor string.
         If you're trying to render a number, try to call the toString() method of it.`,
      );
  }

  /**
   * Creates DOM element from virtual dom and renders it to the provided parent HTMLElement.
   * @param parent
   * @param element - Virtual dom tree
   * @returns
   */
  public appendDomAsChildren(
    parent: HTMLElement,
    element: JSXElement | string,
  ): Text | HTMLElement | PureComponent {
    const nativeElement = this.createDomElement(element);
    if (typeof element !== 'string' && element.portalElement)
      return element.portalElement.appendChild(nativeElement);
    return parent.appendChild(nativeElement);
  }

  /**
   * Creates DOM element from virtual dom and replace the provided HTMLElement with the created one
   * @param prevElement - HTMLElement that needs to be replaced with new one
   * @param prevVDomTree - Old virtual dom tree. Used for removing event listeners of the previous HTMLElement
   * @param newVDomTree - New virtual dom tree. Used for creating new Element.
   * @returns
   */
  public replaceElement(
    prevElement: HTMLElement,
    prevVDomTree: JSXElement,
    newVDomTree: JSXElement,
  ) {
    const newElement = this.createDomElement(newVDomTree);
    prevElement.after(newElement);
    PropsFacade.removeEventListeners(prevElement, prevVDomTree);
    prevElement.remove();
  }
}

export default Engine;
