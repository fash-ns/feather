import JSXFacade from '../core/JSXFacade';
import Utils from '../core/Utils';
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
  private listRef = Utils.createRef<HTMLUListElement>();
  public constructor(props: DetailsComponentPropsType) {
    super(props);
    this.state = { counter: 0 };
    this.handleDecrease = this.handleDecrease.bind(this);
    this.handleIncrease = this.handleIncrease.bind(this);
  }

  private handleIncrease() {
    this.updateState((prev) => ({ counter: prev.counter + 1 }));
    this.engine.getService<TestService>(TestService).greet();
    // console.log(this.listRef.current);
  }

  private handleDecrease() {
    this.updateState((prev) => ({ counter: prev.counter - 1 }));
  }

  protected onStateChange(
    prevState: DetailsComponentStateType,
    newState: DetailsComponentStateType,
  ): void {
    if (newState.counter > 9) this.listRef.current.style.backgroundColor = '#f00';
    else this.listRef.current.style.backgroundColor = '#0f0';
  }

  public render() {
    return (
      <div id="details">
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
        {/* {Utils.createPortal(<AnotherComponent count={this.state.counter} />, document.getElementById('root') as HTMLDivElement)} */}
        {this.state.counter < 10 ? (
          <AnotherComponent count={this.state.counter} />
        ) : (
          <span>Basse</span>
        )}
        <ul ref={this.listRef}>
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
