import JSXFacade from '../core/JSXFacade';
import Component from '../core/components/Component';
import type { ComponentProps } from '../core/interfaces/componentInterfaces';
import TestService from '../services/TestService';
import AnotherComponent from './AnotherComponent';

interface DetailsComponentPropsType extends ComponentProps {
  buttonId: string;
}
interface DetailsComponentStateType {
  counter: number;
}

class DetailsComponent extends Component<DetailsComponentPropsType, DetailsComponentStateType> {
  public constructor(props: DetailsComponentPropsType) {
    super(props);
    this.state = { counter: 0 };
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
  }

  private handleIncrease() {
    this.updateState((prev) => ({ counter: prev.counter + 1 }));
    this.engine.getService<TestService>(TestService).greet();
  }

  private handleDecrease() {
    this.updateState((prev) => ({ counter: prev.counter - 1 }));
  }

  public render() {
    return (
      <div>
        <p>Hey there</p>
        <button type="button" id={this.props.buttonId} onClick={this.handleIncrease}>
          Increase
        </button>
        <button
          type="button"
          id={this.props.buttonId}
          onClick={this.handleDecrease}
          disabled={this.state.counter === 0}
        >
          Decrease
        </button>
        {this.state.counter > 10 ? (
          <span>Button is clicked many times!</span>
        ) : (
          <AnotherComponent count={this.state.counter} />
        )}
        <ul>
          {new Array(this.state.counter).fill(0).map((_, index) => (
            <li onClick={() => console.log(`ITEM ${index} is clicked`)} id={`data-${index}`}>
              ITEM {(index + 1).toString()}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default DetailsComponent;
