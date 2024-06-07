import {
  JSXElementType,
  type EventListenerProp,
  type JSXElement,
} from '../interfaces/JSXInterfaces';

/**
 * Facade for dealing with DOM elements
 */
class DomFacade {
  /**
   * checks the props and returns the event listeners from props. Event listeners are props that starts with 'on'
   * @param props
   * @returns an object which the key of it is the name of the event (without 'on'. For example 'onClick' will be 'click') and the value of the key is the event listener callback.
   */
  public static getEventListenersFromProps(
    props: Record<string, EventListenerProp>,
  ): Record<string, EventListenerProp> {
    const events: Record<string, EventListenerProp> = {};
    Object.entries(props).forEach(([key, val]) => {
      if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        events[eventName] = val;
      }
    });
    return events;
  }

  /**
   * Gets an HTMLElement and set provided attributes / props for it.
   * @param element - the HTMLElement developer wants to set attributes for
   * @param attributes - Set of attributes that should be set for the provided element.
   */
  public static setElementAttributes(
    element: HTMLElement,
    attributes: Record<string, any> | null,
  ): void {
    if (!attributes) return;
    Object.entries(attributes).forEach(([key, val]) => {
      if (key === 'ref') {
        val.current = element;
      } else if (key.startsWith('on')) {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, val);
      } else {
        if (typeof val === 'boolean') (element as any)[key] = val;
        else element.setAttribute(key, val);
      }
    });
  }

  /**
   * Removes all event listeners from a native HTMLElement by extracting event listeners from virtual dom.
   * @param element - the native HTMLElement
   * @param vDomTree - Virual dom tree of the provided element
   */
  public static removeEventListeners(element: Node, vDomTree: JSXElement | string) {
    if (typeof vDomTree === 'string') return;
    if (vDomTree.type === JSXElementType.Element && vDomTree.props !== null) {
      Object.entries(DomFacade.getEventListenersFromProps(vDomTree.props)).forEach(
        ([event, listenerCallback]) => {
          element.removeEventListener(event, listenerCallback);
        },
      );
    }

    vDomTree.children.forEach((child, index) => {
      if (typeof child !== 'string') this.removeEventListeners(element.childNodes[index], child);
    });
  }

  public static removeChildNode(element: ChildNode, vDomTree: JSXElement | string) {
    if (typeof vDomTree !== 'string' && vDomTree.type === JSXElementType.Component) {
      vDomTree.instance.unmount();
    } else {
      this.removeEventListeners(element, vDomTree);
      element.remove();
    }
  }
}

export default DomFacade;
