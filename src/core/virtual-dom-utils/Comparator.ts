import PureComponent from '../components/PureComponent';
import PropsFacade from '../dom-utils/PropsFacade';
import Engine from '../Engine';
import type {
  JSXComponentElement,
  JSXElement,
  JSXNativeElement,
} from '../interfaces/JSXInterfaces';
import { JSXElementType } from '../interfaces/JSXInterfaces';

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
    if (el instanceof Text) Comparator.compareTextNode(engine, el, oldVTree as string, newVTree);
    else if (el instanceof HTMLElement)
      Comparator.compareHTMLElement(engine, el, oldVTree as JSXNativeElement, newVTree);
    else if (el instanceof PureComponent)
      Comparator.compareComponent(engine, el, oldVTree as JSXComponentElement, newVTree);
  }

  /**
   * @inheritdoc Comparator.compare
   */
  private static compareTextNode(
    engine: Engine,
    el: Text,
    oldVTree: string,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      el.remove();
    } else if (typeof newVTree === 'string') {
      if (oldVTree !== newVTree) {
        const newElement = engine.createDomElement(newVTree);
        el.after(newElement);
        el.remove();
      }
    } else {
      const newElement = engine.createDomElement(newVTree);
      el.after(newElement);
      el.remove();
    }
    //Textnodes could not have child nodes.
  }

  /**
   * @inheritdoc Comparator.compare
   */
  private static compareHTMLElement(
    engine: Engine,
    el: HTMLElement,
    oldVTree: JSXNativeElement,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      PropsFacade.removeEventListeners(el, oldVTree);
      el.remove();
    } else if (typeof newVTree === 'string') {
      const newElement = engine.createDomElement(newVTree);
      el.after(newElement);
      PropsFacade.removeEventListeners(el, oldVTree);
      el.remove();
    } else if (oldVTree.type !== newVTree.type || oldVTree.tag !== newVTree.tag) {
      const newElement = engine.createDomElement(newVTree);
      el.after(newElement);
      PropsFacade.removeEventListeners(el, oldVTree);
      el.remove();
    } else {
      PropsFacade.removeEventListeners(el, oldVTree);
      PropsFacade.setElementAttributes(el, newVTree.props);
    }

    //Diff children
    //TODO: Children comparison when using portal sucks
    if (typeof newVTree !== 'string') {
      const childNodesLen = el.childNodes.length;
      const vDomChildrenLen = newVTree.children.length;
      const maxLen = Math.max(childNodesLen, vDomChildrenLen);

      for (let i = 0; i < maxLen; i++) {
        if (childNodesLen <= i) engine.appendDomAsChildren(el as HTMLElement, newVTree.children[i]);
        else if (vDomChildrenLen <= i) {
          if (typeof oldVTree.children[i] !== 'string') {
            if ((oldVTree.children[i] as JSXElement).type === JSXElementType.Component) {
              (oldVTree.children[i] as JSXComponentElement).instance.unmount();
            } else {
              PropsFacade.removeEventListeners(
                el.childNodes.item(i),
                oldVTree.children[i] as JSXElement,
              );
              el.childNodes.item(i).remove();
            }
          } else {
            el.childNodes.item(i).remove();
          }
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
          Comparator.compare(
            engine,
            el.childNodes.item(i) as HTMLElement | Text,
            oldVTree.children[i],
            newVTree.children[i],
          );
        }
      }
    }
  }

  /**
   * @inheritdoc Comparator.compare
   */
  private static compareComponent(
    engine: Engine,
    el: PureComponent,
    oldVTree: JSXComponentElement,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) el.unmount();
    else if (typeof newVTree === 'string') {
      const newElement = engine.createDomElement(newVTree);
      el.getDomElement().after(newElement);
      el.unmount();
    } else if (oldVTree.type !== newVTree.type || oldVTree.tag !== newVTree.tag) {
      const newElement = engine.createDomElement(newVTree);
      el.getDomElement().after(newElement);
      el.unmount();
    } else {
      el.setProps({ ...newVTree.props, children: newVTree.children });
      newVTree.instance = el;
    }

    //Children of components are handled using props.
  }
}

export default Comparator;
