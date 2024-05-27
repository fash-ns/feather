import PureComponent from './components/PureComponent';
import { ClassConstructor } from './interfaces/globalInterfaces';
import { JSXElementType, JSXRenderedElement, type JSXElement } from './interfaces/JSXInterfaces';

class Renderer {
  public static renderRoot(element: ClassConstructor<PureComponent>, container: HTMLElement) {
    const instance = new element(null, container);
    return Renderer.appendDom(container, instance.render());
  }

  public static appendDom(
    parent: HTMLElement,
    element: JSXElement | string,
  ): JSXRenderedElement | Text {
    let processedElement: Text | HTMLElement | PureComponent = null;
    const renderedElementTree: JSXRenderedElement = element as JSXRenderedElement;

    if (typeof element === 'string') {
      processedElement = document.createTextNode(element);
      parent.appendChild(processedElement);
      return processedElement;
    } else if (element.type === JSXElementType.Component) {
      const component = new element.tag({ ...element.props, children: element.children }, parent);
      component.mount();
      processedElement = component;
    } else {
      const nativeElement = document.createElement(element.tag);
      if (element.props) {
        Object.entries(element.props).forEach(([key, val]) => {
          if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            if (renderedElementTree.eventListeners)
              renderedElementTree.eventListeners[eventName] = val;
            else renderedElementTree.eventListeners = { [eventName]: val };
            nativeElement.addEventListener(
              eventName,
              renderedElementTree.eventListeners[eventName],
            );
          } else if (typeof val === 'boolean') {
            (nativeElement as any)[key] = val;
          } else nativeElement.setAttribute(key, val);
        });
      }
      parent.appendChild(nativeElement);
      if (element.children) {
        renderedElementTree.children = element.children.map((child) => {
          return Renderer.appendDom(nativeElement, child);
        });
      }
      processedElement = nativeElement;
    }
    return { ...renderedElementTree, element: processedElement };
  }

  public static removeDom(jsxEl: JSXRenderedElement | Text) {
    if (jsxEl instanceof Text) {
      jsxEl.remove();
    } else if (jsxEl.element instanceof PureComponent) {
      jsxEl.element.unmount();
    } else {
      if (jsxEl.eventListeners) {
        Object.entries(jsxEl.eventListeners).forEach(([eventName, listener]) => {
          (jsxEl.element as HTMLElement).removeEventListener(eventName, listener);
        });
        jsxEl.eventListeners = {};
      }
      jsxEl.children.forEach((child) => {
        Renderer.removeDom(child);
      });
      jsxEl.element.remove();
    }
  }
}

export default Renderer;
