import PureComponent from '../components/PureComponent';
import DomFacade from '../dom-utils/DomFacade';
import type Engine from '../Engine';
import {
  JSXElementType,
  type JSXComponentElement,
  type JSXElement,
} from '../interfaces/JSXInterfaces';

class Comparator {
  /**
   * An instance of engine
   */
  private engine: Engine;

  public constructor(engine: Engine) {
    this.engine = engine;
  }
  /**
   * Compares old tree with new tree and updates the DOM elements.
   *
   * @param engine - An instance of engine
   * @param el - The root element of the tree
   * @param oldVTree - Old virtual dom tree
   * @param newVTree - New virtual dom tree
   */
  public compare(
    el: HTMLElement | Text | PureComponent,
    oldVTree: JSXElement | string,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      if (el instanceof PureComponent) el.unmount();
      else {
        DomFacade.removeChildNode(el, oldVTree);
      }
      return;
    }
    if (this.shouldReplaceElement(oldVTree, newVTree))
      return this.engine.replaceElement(el, oldVTree, newVTree);

    if (typeof oldVTree !== 'string' && typeof newVTree !== 'string') {
      if (!(el instanceof Text)) this.updateElementProps(el, oldVTree, newVTree);
      if (!!oldVTree.portalContainer) newVTree.portalElement = oldVTree.portalElement;
    }

    //Diff children
    if (el instanceof HTMLElement) {
      oldVTree = oldVTree as JSXElement;
      newVTree = newVTree as JSXElement;
      const childNodesLen = el.childNodes.length;
      const vDomChildrenLen = newVTree.children.length;
      const maxLen = Math.max(childNodesLen, vDomChildrenLen);

      for (let i = 0; i < maxLen; i++) {
        if (childNodesLen <= i) this.engine.appendDomAsChildren(el, newVTree.children[i]);
        else if (vDomChildrenLen <= i) {
          DomFacade.removeChildNode(el.childNodes.item(i), oldVTree.children[i]);
        } else if (
          typeof oldVTree.children[i] !== 'string' &&
          (oldVTree.children[i] as JSXElement).type === JSXElementType.Component
        ) {
          this.compare(
            (oldVTree.children[i] as JSXComponentElement).instance,
            oldVTree.children[i],
            newVTree.children[i],
          );
        } else {
          this.compare(
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
  private shouldReplaceElement(
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

    // Both are JSXElement which initiate component but initiated components are different
    if (oldVTree.type === JSXElementType.Component && oldVTree.tag.constructor !== newVTree.tag.constructor)
      return true;

    // Both are JSXElements and renders HTMLElement but with different HTML tags
    if (oldVTree.tag !== newVTree.tag) return true;

    return false;
  }

  /**
   * Updates element's props from virtual dom tree
   * @param el - Element whom props needs to be updated
   * @param oldVTree - Current DOM virtual tree
   * @param newVTree - New virtual dom
   */
  private updateElementProps(
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
