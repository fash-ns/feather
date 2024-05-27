import PureComponent from './components/PureComponent';
import { ClassConstructor } from './interfaces/globalInterfaces';
import {
    JSXElementType,
    type JSXElement,
    type JSXRenderedElement,
} from './interfaces/JSXInterfaces';
import Renderer from './Renderer';

class JSXComparator {
    public static compare(
        parent: HTMLElement,
        prevTree: JSXRenderedElement | Text,
        currentTree: JSXElement | string,
    ) {
        if (
            (prevTree instanceof Text && typeof currentTree !== 'string') ||
            (!(prevTree instanceof Text) && typeof currentTree === 'string') ||
            (prevTree instanceof Text &&
                typeof currentTree === 'string' &&
                prevTree.toString() !== currentTree) ||
            (prevTree as JSXRenderedElement).type !== (currentTree as JSXElement).type ||
            ((prevTree as JSXRenderedElement).type === JSXElementType.Element &&
                (currentTree as JSXElement).type === JSXElementType.Element &&
                (prevTree as JSXRenderedElement).tag !== (currentTree as JSXElement).tag) ||
            ((prevTree as JSXRenderedElement).type === JSXElementType.Component &&
                (currentTree as JSXElement).type === JSXElementType.Component &&
                ((prevTree as JSXRenderedElement).tag as PureComponent).constructor.name !==
                ((currentTree as JSXElement).tag as ClassConstructor<PureComponent>).name)
        ) {
            if ((prevTree as JSXRenderedElement).type === JSXElementType.Component)
                ((prevTree as JSXRenderedElement).tag as PureComponent).unmount();
            else Renderer.removeDom(prevTree);
            prevTree = Renderer.appendDom(parent, currentTree); //TODO: Is it pass by reference?
        }

        else {
            const prevProps = (prevTree as JSXRenderedElement).props;
            const currentProps = (currentTree as JSXElement).props
            if ((prevTree as JSXRenderedElement).type === JSXElementType.Element) {
                Object.keys(prevProps).forEach(property => {
                    if (prevProps[property] !== currentProps[property]) {
                        if (typeof currentProps[property] === 'boolean') {
                            ((prevTree as JSXRenderedElement).element as any)[property] = currentProps[property];
                        } else ((prevTree as JSXRenderedElement).element as HTMLElement).setAttribute(property, currentProps[property]);
                    }
                })
            } else {
                ((prevTree as JSXRenderedElement).tag as PureComponent).updateProps(currentProps);
            }
            (prevTree as JSXRenderedElement).props = (currentTree as JSXElement).props;
        }
        //TODO: Add children partial render
    }
}

export default JSXComparator;
