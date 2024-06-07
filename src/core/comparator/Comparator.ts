import PureComponent from '../components/PureComponent';
import DomFacade from '../dom-utils/DomFacade';
import type Engine from '../Engine';
import type { JSXComponentElement, JSXElement } from '../interfaces/JSXInterfaces';
import { JSXElementType } from '../interfaces/JSXInterfaces';

class Comparator {
  /**
   * Compares old tree with new tree and updates the DOM elements.
   *
   * @param engine - An instance of engine
   * @param el - The root element of the tree
   * @param oldVTree - Old virtual dom tree
   * @param newVTree - New virtual dom tree
   */
  public static compare(
    engine: Engine,
    el: HTMLElement | Text | PureComponent,
    oldVTree: JSXElement | string,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      if (el instanceof PureComponent) el.unmount();
      else {
        DomFacade.removeEventListeners(el, oldVTree);
        el.remove();
      }
      return;
    }
    if (Comparator.shouldReplaceElement(oldVTree, newVTree))
      return engine.replaceElement(el, oldVTree, newVTree);

    if (!(el instanceof Text) && typeof oldVTree !== 'string' && typeof newVTree !== 'string')
      Comparator.updateElementProps(el, oldVTree, newVTree);

    //Diff children
    if (el instanceof HTMLElement) {
      oldVTree = oldVTree as JSXElement;
      newVTree = newVTree as JSXElement;
      const childNodesLen = el.childNodes.length;
      const vDomChildrenLen = newVTree.children.length;
      const maxLen = Math.max(childNodesLen, vDomChildrenLen);
      let portalCount = 0;

      for (let i = 0; i < maxLen; i++) {
        if (
          i < oldVTree.children.length &&
          typeof oldVTree.children[i] !== 'string' &&
          !!(oldVTree.children[i] as JSXElement).portalContainer
        )
          portalCount += 1;
        const childNodeIndex = i - portalCount;

        if (childNodesLen <= childNodeIndex) engine.appendDomAsChildren(el, newVTree.children[i]);
        else if (vDomChildrenLen <= i) {
          DomFacade.removeChildNode(el.childNodes.item(childNodeIndex), oldVTree);
        } else if (
          typeof oldVTree.children[i] !== 'string' &&
          (oldVTree.children[i] as JSXElement).type === JSXElementType.Component
        ) {
          Comparator.compare(
            engine,
            (oldVTree.children[i] as JSXComponentElement).instance,
            oldVTree.children[i],
            newVTree.children[i],
          );
        } else {
          if (!!oldVTree.portalElement)
            Comparator.compare(
              engine,
              oldVTree.portalElement,
              oldVTree.children[i],
              newVTree.children[i],
            );
          else
            Comparator.compare(
              engine,
              el.childNodes.item(i) as HTMLElement | Text,
              oldVTree.children[i],
              newVTree.children[i],
            );
        }
      }
    }
    return el;
  }

  /**
   * Checks whether an element needs to be replaced by the new created element.
   * This decision is made by comparing current virtual dom tree with new one.
   * @param oldVTree - Current DOM virtual tree
   * @param newVTree - New virtual dom
   * @returns Boolean: true if the element should be re-created from the new
   * virtual dom tree and false otherwise.
   */
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

  /**
   * Updates element's props from virtual dom tree
   * @param el - Element whom props needs to be updated
   * @param oldVTree - Current DOM virtual tree
   * @param newVTree - New virtual dom
   */
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

export default Comparator;
