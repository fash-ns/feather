import Comparator from '../comparator/Comparator';
import DomFacade from '../dom-utils/DomFacade';
import Engine from '../Engine';
import type { ComponentProps } from '../interfaces/componentInterfaces';
import type { JSXElement } from '../interfaces/JSXInterfaces';

/**
 * @public
 * Base class for implementing app components. It's generic typed since developer can define
 * the type of the component's props. Component props type should be inherited from ComponentProps
 * @see ComponentProps to check which keys are available out of the box for a component.
 */
abstract class PureComponent<Props extends ComponentProps = ComponentProps> {
  /**
   * Holds the current component props
   */
  protected props: Omit<Props, 'engine'>;
  /**
   * A tree is built by calling the render method of a component. This tree is hold inside this variable
   */
  private tree: JSXElement;
  /**
   * After the DOM is created for the component, It is hold inside this variable
   */
  private rootElement: Text | HTMLElement | PureComponent;
  /**
   * The root engine instance is injected to all components. It's mainly useful for dependency injection.
   */
  protected engine: Engine;

  /**
   * An instance of Comparator class with injected engine.
   */
  private comparator: Comparator;

  public constructor(props: Props) {
    this.engine = props.engine;
    delete props.engine;
    this.props = props;
    this.comparator = new Comparator(this.engine);
  }

  /**
   * Creates the component's DOM element.
   * Node: It just creates the element. Rendering the element is another procedure which is handled by Engine
   * @returns The created root element of the component
   * @see Engine.createDomElement to check how this element is created
   */
  public createDomElement(): HTMLElement | Text {
    this.tree = this.render();
    this.rootElement = this.engine.createDomElement(this.tree);
    this.onMount();
    return this.rootElement;
  }

  /**
   * @returns The root element created by component.
   */
  public getDomElement(): HTMLElement | Text {
    if (this.rootElement instanceof PureComponent) return this.rootElement.getDomElement();
    return this.rootElement;
  }

  /**
   * When props is changed by a top level component's state, the new props will be set for the component using setProps method.
   * It triggers an update for the component.
   * @param props - new props of the component.
   */
  public setProps(props: Omit<Props, 'engine'>): void {
    if (Object.is(props, this.props)) return;
    this.onPropsChange(this.props, props);
    this.props = props;
    this.update();
  }

  /**
   * Build the new tree with new attributes (new state and props for Components and new props for PureComponents) and compares it to previously built tree.
   * Then updates only necessary parts. Comparison procedure is done by Comparator facade.
   * @see Comparator.compare to check how a tree is compared to the old one.
   */
  protected update(): void {
    const newTree = this.render();
    this.rootElement = this.comparator.compare(this.rootElement, this.tree, newTree);
    this.tree = newTree;
    this.onUpdateFinished();
  }

  /**
   * Removes everything which is rendered by the component.
   */
  public unmount(): void {
    this.onUnmount();
    DomFacade.removeChildNode(this.getDomElement(), this.tree);
    delete this.tree;
    delete this.rootElement;
  }

  /**
   * onMount method is triggered when the component's DOM is rendered for the first time.
   */
  protected onMount(): void { }

  /**
   * onUnmount method is triggered when the component is being to be unmounted.
   */
  protected onUnmount(): void { }

  /**
   * onPropsChange method is triggered when the component's props are going to be updated.
   * @param prevProps - props before being updated
   * @param newProps = props after update
   */
  protected onPropsChange(
    prevProps: Omit<Props, 'engine'>,
    newProps: Omit<Props, 'engine'>,
  ): void { }

  /**
   * onUpdateFinished method is triggered after the component is updated.
   */
  protected onUpdateFinished(): void { }

  /**
   * All the JSX render should be returned by this method. All components must implement this method.
   */
  public abstract render(): JSXElement;
}

export default PureComponent;
