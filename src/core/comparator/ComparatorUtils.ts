import PureComponent from '../components/PureComponent';
import DomFacade from '../dom-utils/DomFacade';
import { JSXComponentElement, type JSXElement } from '../interfaces/JSXInterfaces';

class ComparatorUtils {
  public static shouldReplaceElement(
    oldVTree: JSXElement | string,
    newVTree: JSXElement | string,
  ): boolean {
    // one is string and one is JSXElement
    if (typeof oldVTree !== typeof newVTree) return true;

    // Both are strings but with different texts
    if (typeof oldVTree === 'string' && typeof newVTree === 'string') {
      if (oldVTree !== newVTree) return true;
      return false;
    }

    oldVTree = oldVTree as JSXElement;
    newVTree = newVTree as JSXElement;

    // Both are JSXElements but with different portal containers
    if (oldVTree.portalContainer !== newVTree.portalContainer) return true;

    // Both are JSXElements but with different types
    if (oldVTree.type !== newVTree.type) return true;

    // Both are JSXElements and renders HTMLElement but with different HTML tags
    // Or Both are JSXElements and renders Component but different components
    if (oldVTree.tag !== newVTree.tag) return true;

    return false;
  }

  public static updateElementProps(
    el: HTMLElement | PureComponent,
    oldVTree: JSXElement,
    newVTree: JSXElement,
  ) {
    if (el instanceof HTMLElement) {
      DomFacade.removeEventListeners(el, oldVTree);
      DomFacade.setElementAttributes(el, newVTree.props);
    } else if (el instanceof PureComponent) {
      el.setProps({ ...newVTree.props, children: newVTree.children });
      (newVTree as JSXComponentElement).instance = el;
    }
  }
}

export default ComparatorUtils;
