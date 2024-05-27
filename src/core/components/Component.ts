import type { ComponentProps } from '../interfaces/componentInterfaces';
import PureComponent from './PureComponent';

abstract class Component<
  Props extends ComponentProps = ComponentProps,
  State = any,
> extends PureComponent<Props> {
  protected state: State;

  protected setState(state: State) {
    if (Object.is(state, this.state)) return;
    this.state = state;
    this.update();
  }

  protected updateState(mutator: (prev: State) => State) {
    const state = mutator(this.state);
    if (Object.is(state, this.state)) return;
    this.state = state;
    this.update();
  }
}

export default Component;
