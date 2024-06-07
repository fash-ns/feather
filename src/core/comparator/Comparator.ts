import PureComponent from '../components/PureComponent';
import DomFacade from '../dom-utils/DomFacade';
import Engine from '../Engine';
import type { JSXComponentElement, JSXElement } from '../interfaces/JSXInterfaces';
import { JSXElementType } from '../interfaces/JSXInterfaces';
import ComparatorUtils from './ComparatorUtils';

class Comparator {
  /**
   *
   * Compares old tree with new tree and updates the DOM elements.
   * Elements should be a TextNode, an HTMLElement or a component. For each of these types, a separate method is implemented
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
    if (ComparatorUtils.shouldReplaceElement(oldVTree, newVTree))
      return engine.replaceElement(el, oldVTree, newVTree);

    if (!(el instanceof Text) && typeof oldVTree !== 'string' && typeof newVTree !== 'string')
      ComparatorUtils.updateElementProps(el, oldVTree, newVTree);

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
}

export default Comparator;
