import JSXFacade from '../core/JSXFacade';
import Component from '../core/components/Component';
import type { ComponentProps } from '../core/interfaces/componentInterfaces';
import AnotherComponent from './AnotherComponent';

interface DetailsComponentPropsType extends ComponentProps {
  buttonId: string;
}
interface DetailsComponentStateType {
  counter: number;
}

class DetailsComponent extends Component<DetailsComponentPropsType, DetailsComponentStateType> {
  public constructor(props: DetailsComponentPropsType, parent: HTMLElement) {
    super(props, parent);
    this.state = { counter: 0 };
  }
  public render() {
    return (
      <div>
        <p>Hey there</p>
        <button
          type="button"
          id={this.props.buttonId}
          onClick={(e: MouseEvent) => this.setState({ counter: this.state.counter + 1 })}
        >
          Increase
        </button>
        <button
          type="button"
          id={this.props.buttonId}
          onClick={(e: MouseEvent) => this.setState({ counter: this.state.counter - 1 })}
          disabled={this.state.counter === 0}
        >
          Decrease
        </button>
        <AnotherComponent count={this.state.counter} />
      </div>
    );
  }
}

export default DetailsComponent;
