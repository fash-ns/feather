import PropsFacade from "../../dom-utils/PropsFacade";
import Renderer from "../../dom-utils/Renderer";
import { JSXElementType, type JSXElement } from "../../interfaces/JSXInterfaces";

class Comparator {
    public static compare(el: HTMLElement | Text, oldVTree: JSXElement | string, newVTree: JSXElement | string | undefined) {
        debugger;
        if (newVTree === undefined) {
            if (typeof oldVTree !== "string")
                Renderer.removeEventListeners(el, oldVTree)
            el.remove();
        }

        else if (typeof oldVTree === 'string' ||
            typeof newVTree === 'string') {
            if (oldVTree !== newVTree) {
                const newElement = Renderer.createDomElement(newVTree);
                el.after(newElement);
                if (typeof oldVTree !== "string")
                    Renderer.removeEventListeners(el, oldVTree)
                el.remove();
            }
        }

        else if (oldVTree.type !== newVTree.type || oldVTree.tag !== newVTree.tag) {
            const newElement = Renderer.createDomElement(newVTree);
            el.after(newElement);
            if (typeof oldVTree !== "string")
                Renderer.removeEventListeners(el, oldVTree)
            el.remove();
        }

        else if (el instanceof HTMLElement && oldVTree.type === JSXElementType.Element) {
            Renderer.removeEventListeners(el, oldVTree);
            PropsFacade.setElementAttributes(el, newVTree.props);
        }

        //Diff children
        if (typeof newVTree !== "string" && typeof oldVTree !== "string") {
            const childNodesLen = el.childNodes.length;
            const vDomChildrenLen = newVTree.children.length;
            const maxLen = Math.max(childNodesLen, vDomChildrenLen);

            for (let i = 0; i < maxLen; i++) {
                if (childNodesLen <= i)
                    Renderer.appendDomAsChildren(el as HTMLElement, newVTree.children[i]);
                else if (vDomChildrenLen <= i) {
                    if (typeof oldVTree !== "string" && typeof oldVTree.children[i] !== "string")
                        Renderer.removeEventListeners(el.childNodes.item(i), oldVTree.children[i] as JSXElement)
                    el.childNodes.item(i).remove();
                }
                else
                    Comparator.compare(el.childNodes.item(i) as (HTMLElement | Text), oldVTree.children[i], newVTree.children[i])
            }
        }
    }
}

export default Comparator;