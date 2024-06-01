import PureComponent from '../components/PureComponent';
import PropsFacade from '../dom-utils/PropsFacade';
import Renderer from '../Engine';
import type {
  JSXComponentElement,
  JSXElement,
  JSXNativeElement,
} from '../interfaces/JSXInterfaces';
import { JSXElementType } from '../interfaces/JSXInterfaces';

class Comparator {
  public static compare(
    renderer: Renderer,
    el: HTMLElement | Text | PureComponent,
    oldVTree: JSXElement | string,
    newVTree: JSXElement | string | undefined,
  ) {
    if (el instanceof Text) Comparator.compareTextNode(renderer, el, oldVTree as string, newVTree);
    else if (el instanceof HTMLElement)
      Comparator.compareHTMLElement(renderer, el, oldVTree as JSXNativeElement, newVTree);
    else if (el instanceof PureComponent)
      Comparator.compareComponent(renderer, el, oldVTree as JSXComponentElement, newVTree);
  }

  private static compareTextNode(
    renderer: Renderer,
    el: Text,
    oldVTree: string,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      el.remove();
    } else if (typeof newVTree === 'string') {
      if (oldVTree !== newVTree) {
        const newElement = renderer.createDomElement(newVTree);
        el.after(newElement);
        el.remove();
      }
    } else {
      const newElement = renderer.createDomElement(newVTree);
      el.after(newElement);
      el.remove();
    }
    //Textnodes could not have child nodes.
  }

  private static compareHTMLElement(
    renderer: Renderer,
    el: HTMLElement,
    oldVTree: JSXNativeElement,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) {
      renderer.removeEventListeners(el, oldVTree);
      el.remove();
    } else if (typeof newVTree === 'string') {
      const newElement = renderer.createDomElement(newVTree);
      el.after(newElement);
      renderer.removeEventListeners(el, oldVTree);
      el.remove();
    } else if (oldVTree.type !== newVTree.type || oldVTree.tag !== newVTree.tag) {
      const newElement = renderer.createDomElement(newVTree);
      el.after(newElement);
      renderer.removeEventListeners(el, oldVTree);
      el.remove();
    } else {
      renderer.removeEventListeners(el, oldVTree);
      PropsFacade.setElementAttributes(el, newVTree.props);
    }

    //Diff children
    if (typeof newVTree !== 'string') {
      const childNodesLen = el.childNodes.length;
      const vDomChildrenLen = newVTree.children.length;
      const maxLen = Math.max(childNodesLen, vDomChildrenLen);

      for (let i = 0; i < maxLen; i++) {
        if (childNodesLen <= i)
          renderer.appendDomAsChildren(el as HTMLElement, newVTree.children[i]);
        else if (vDomChildrenLen <= i) {
          if (typeof oldVTree.children[i] !== 'string') {
            if ((oldVTree.children[i] as JSXElement).type === JSXElementType.Component) {
              (oldVTree.children[i] as JSXComponentElement).instance.unmount();
            } else {
              renderer.removeEventListeners(
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
            renderer,
            (oldVTree.children[i] as JSXComponentElement).instance,
            oldVTree.children[i],
            newVTree.children[i],
          );
        } else {
          Comparator.compare(
            renderer,
            el.childNodes.item(i) as HTMLElement | Text,
            oldVTree.children[i],
            newVTree.children[i],
          );
        }
      }
    }
  }

  private static compareComponent(
    renderer: Renderer,
    el: PureComponent,
    oldVTree: JSXComponentElement,
    newVTree: JSXElement | string | undefined,
  ) {
    if (newVTree === undefined) el.unmount();
    else if (typeof newVTree === 'string') {
      const newElement = renderer.createDomElement(newVTree);
      el.getDomElement().after(newElement);
      el.unmount();
    } else if (oldVTree.type !== newVTree.type || oldVTree.tag !== newVTree.tag) {
      const newElement = renderer.createDomElement(newVTree);
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
