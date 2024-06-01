import PureComponent from './components/PureComponent';
import DependencyContainer from './DependencyContainer';
import PropsFacade from './dom-utils/PropsFacade';
import { ClassConstructor } from './interfaces/globalInterfaces';
import type { JSXElement } from './interfaces/JSXInterfaces';
import { JSXElementType } from './interfaces/JSXInterfaces';
import Service from './Service';

class Engine {
  private di: DependencyContainer;

  public constructor() {
    this.di = new DependencyContainer();
  }

  public registerService(constructor: any) {
    this.di.register(constructor, new constructor());
  }

  public getService<T extends Service>(constructor: typeof Service): T {
    return this.di.retrieve(constructor) as T;
  }

  public renderRoot(element: ClassConstructor<PureComponent>, container: HTMLElement) {
    const instance = new element(null);
    instance.engine = this;
    const nativeElement = instance.createDomElement();
    container.appendChild(nativeElement);
  }

  public createDomElement(element: JSXElement | string) {
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
    const component = new element.tag({ ...element.props, children: element.children });
    component.engine = this;
    const nativeElement = component.createDomElement();
    element.instance = component;
    return nativeElement;
  }

  public appendDomAsChildren(
    parent: HTMLElement,
    element: JSXElement | string,
  ): Text | HTMLElement | PureComponent {
    const nativeElement = this.createDomElement(element);
    return parent.appendChild(nativeElement);
  }

  public replaceElement(
    prevElement: HTMLElement,
    prevVDomTree: JSXElement,
    newVDomTree: JSXElement,
  ) {
    const newElement = this.createDomElement(newVDomTree);
    prevElement.after(newElement);
    this.removeEventListeners(prevElement, prevVDomTree);
    prevElement.remove();
  }

  public removeEventListeners(element: Node, vDomTree: JSXElement) {
    if (vDomTree.type === JSXElementType.Element && vDomTree.props !== null) {
      Object.entries(PropsFacade.getEventListenersFromProps(vDomTree.props)).forEach(
        ([event, listenerCallback]) => {
          element.removeEventListener(event, listenerCallback);
        },
      );
    }

    vDomTree.children.forEach((child, index) => {
      if (typeof child !== 'string') this.removeEventListeners(element.childNodes[index], child);
    });
  }
}

export default Engine;
