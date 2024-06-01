import Renderer from '../Engine';
import type { ComponentProps } from '../interfaces/componentInterfaces';
import type { JSXElement } from '../interfaces/JSXInterfaces';
import Comparator from '../virtual-dom-utils/Comparator';

abstract class PureComponent<Props extends ComponentProps = ComponentProps> {
  protected props: Props;
  private tree: JSXElement;
  private rootElement: Text | HTMLElement;
  public engine: Renderer;

  public constructor(props: Props) {
    this.props = props;
  }

  public createDomElement(): HTMLElement | Text {
    this.tree = this.render();
    this.rootElement = this.engine.createDomElement(this.tree);
    return this.rootElement;
  }

  public getDomElement(): HTMLElement | Text {
    return this.rootElement;
  }

  public setProps(props: Props) {
    this.props = props;
    this.update();
  }

  protected update() {
    const newTree = this.render();
    Comparator.compare(this.engine, this.rootElement, this.tree, newTree);
    delete this.tree;
    this.tree = newTree;
  }

  public unmount() {
    this.engine.removeEventListeners(this.rootElement, this.tree);
    this.rootElement.remove();
  }

  public abstract render(): JSXElement;
}

export default PureComponent;
