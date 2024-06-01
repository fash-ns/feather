import { JSXElement, RefObject } from './interfaces/JSXInterfaces';

/**
 * A facade for JSX utils
 */
class Utils {
  /**
   * JSX references are special props which holds the element instance.
   * In order to use refs, a special object should be passed to `ref` property.
   * This method returns the ref object.
   * @param initialValue - initial value of the reference.
   * @returns Ref object
   */
  public static createRef<T>(initialValue: T = null): RefObject<T> {
    return { current: initialValue };
  }

  /**
   * Portals are useful when developer wants a part of virtual dom tree to be rendered
   * outside its parent. Rendering element is not this method's responsibility and all
   * renderes are handled by Engine.
   * @param tree - Partial virtual dom tree
   * @param element - Parent element in which created DOM from virtual dom is rendered into.
   * @returns the modified virtual dom.
   * @see Engine.appendDomAsChildren to check how portals are handled.
   */
  public static createPortal(tree: JSXElement, element: HTMLElement): JSXElement {
    tree.portalElement = element;
    return tree;
  }
}

export default Utils;
