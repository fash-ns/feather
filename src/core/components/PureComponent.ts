import Renderer from '../dom-utils/Renderer';
import type { ComponentProps } from '../interfaces/componentInterfaces';
import type { JSXElement } from '../interfaces/JSXInterfaces';
import Comparator from './virtual-dom-utils/Comparator';

abstract class PureComponent<Props extends ComponentProps = ComponentProps> {
  protected props: Props;
  private tree: JSXElement;
  private rootElement: Text | HTMLElement;

  public constructor(props: Props) {
    this.props = props;
  }

  public createDomElement(): HTMLElement | Text {
    this.tree = this.render();
    this.rootElement = Renderer.createDomElement(this.tree);
    console.log(`${this.constructor.name}'s native HTML element is created`, { virtualDom: this.tree, realDom: this.rootElement });
    return this.rootElement;
  }

  public getDomElement(): HTMLElement | Text {
    return this.rootElement;
  }

  protected update() {
    const newTree = this.render();
    console.log("NEW TREE", newTree);
    Comparator.compare(this.rootElement, this.tree, newTree);
    this.tree = newTree;
  }

  public abstract render(): JSXElement;
}

export default PureComponent;
