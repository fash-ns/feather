import type { ComponentProps } from '../interfaces/componentInterfaces';
import PureComponent from './PureComponent';

/**
 * @public
 * @inheritdoc PureComponent
 * Components support state in addition to PureComponents functionalities.
 * It's generic typed since developer can define the type of the component's props and states.
 */
abstract class Component<
  Props extends ComponentProps = ComponentProps,
  State = any,
> extends PureComponent<Props> {
  /**
   * Holds the current component's state.
   */
  protected state: State;

  /**
   * Totally replaces the component's state with the provided state and triggers an update.
   * @param state - New state for the component
   */
  protected setState(state: State): void {
    if (Object.is(state, this.state)) return;
    this.onStateChange(this.state, state);
    this.state = state;
    this.update();
  }

  /**
   * Runs the provided callback and updates the state of the component and triggers an update.
   * @param mutator - The callback which retrieves previous state as an argument and must return the new state.
   */
  protected updateState(mutator: (prev: State) => State): void {
    const state = mutator(this.state);
    if (Object.is(state, this.state)) return;
    this.onStateChange(this.state, state);
    this.state = state;
    this.update();
  }

  /**
   * onStateChange method is triggered when the component's state is going to be updated.
   * @param prevState - state before being updated
   * @param newState = state after update
   */
  protected onStateChange(prevState: State, newState: State) {}
}

export default Component;
