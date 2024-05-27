import type { ComponentProps } from '../interfaces/componentInterfaces';
import type { JSXElement, JSXRenderedElement } from '../interfaces/JSXInterfaces';
import Renderer from '../Renderer';

abstract class PureComponent<Props extends ComponentProps = ComponentProps> {
  protected props: Props;
  protected parentElement: HTMLElement;
  protected tree: JSXElement;
  protected renderedTree: JSXRenderedElement | Text;

  public constructor(props: Props, parent: HTMLElement) {
    this.props = props;
    this.parentElement = parent;
  }

  public updateProps(props: Props) {
    this.props = props;
    //TODO: Handle update logic here
  }

  public mount() {
    this.tree = this.render();
    this.renderedTree = Renderer.appendDom(this.parentElement, this.tree);
    console.log(this.tree);
  }

  public unmount() {
    Renderer.removeDom(this.renderedTree);
  }

  //TODO: Test
  public update() {
    this.unmount();
    this.mount();
  }

  public abstract render(): JSXElement;
}

export default PureComponent;
