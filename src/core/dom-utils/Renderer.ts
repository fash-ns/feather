import PureComponent from '../components/PureComponent';
import { ClassConstructor } from '../interfaces/globalInterfaces';
import type { JSXElement } from '../interfaces/JSXInterfaces';
import { JSXElementType } from '../interfaces/JSXInterfaces';
import PropsFacade from './PropsFacade';

class Renderer {
  public static renderRoot(element: ClassConstructor<PureComponent>, container: HTMLElement) {
    const instance = new element(null);
    const nativeElement = instance.createDomElement();
    container.appendChild(nativeElement);
  }

  public static createDomElement(element: JSXElement | string) {
    if (typeof element === 'string') {
      const textElement = document.createTextNode(element);
      return textElement;
    }

    if (element.type === JSXElementType.Element) {
      const nativeElement = document.createElement(element.tag);
      if (element.props)
        PropsFacade.setElementAttributes(nativeElement, element.props)

      if (element.children) {
        element.children.forEach((child) => {
          Renderer.appendDomAsChildren(nativeElement, child);
        });
      }
      return nativeElement;
    }
    const component = new element.tag({ ...element.props, children: element.children });
    const nativeElement = component.createDomElement();
    return nativeElement;
  }

  public static appendDomAsChildren(
    parent: HTMLElement,
    element: JSXElement | string,
  ): Text | HTMLElement | PureComponent {
    const nativeElement = Renderer.createDomElement(element);
    return parent.appendChild(nativeElement);
  }

  public static replaceElement(prevElement: HTMLElement, prevVDomTree: JSXElement, newVDomTree: JSXElement) {
    const newElement = Renderer.createDomElement(newVDomTree);
    prevElement.after(newElement);
    Renderer.removeEventListeners(prevElement, prevVDomTree);
    prevElement.remove();
  }

  public static removeEventListeners(element: Node, vDomTree: JSXElement) {
    if (vDomTree.type === JSXElementType.Element && vDomTree.props !== null) {
      Object.entries(PropsFacade.getEventListenersFromProps(vDomTree.props)).forEach(([event, listenerCallback]) => {
        element.removeEventListener(event, listenerCallback);
      })
    }

    vDomTree.children.forEach((child, index) => {
      if (typeof child !== "string")
        Renderer.removeEventListeners(element.childNodes[index], child)
    })
  }
}

export default Renderer;
