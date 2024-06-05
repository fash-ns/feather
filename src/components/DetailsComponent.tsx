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
  list: Array<string>;
}

class DetailsComponent extends Component<DetailsComponentPropsType, DetailsComponentStateType> {
  private listRef = Utils.createRef<HTMLUListElement>();
  public constructor(props: DetailsComponentPropsType) {
    super(props);
    this.state = { list: [] };
    this.handleGenerate = this.handleGenerate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  private handleGenerate() {
    this.updateState((prev) => ({
      list: [...prev.list, Math.floor(Math.random() * 1000000).toString()],
    }));
    this.engine.getService<TestService>(TestService).greet();
  }

  private handleDelete(id: string) {
    this.updateState((prev) => ({ list: prev.list.filter((item) => item !== id) }));
  }

  protected onStateChange(
    prevState: DetailsComponentStateType,
    newState: DetailsComponentStateType,
  ): void {
    if (newState.list.length > 9) this.listRef.current.style.backgroundColor = '#f00';
    else this.listRef.current.style.backgroundColor = '#0f0';
  }

  public render() {
    return (
      <div id="details">
        <p>Hey there</p>
        <button type="button" id={this.props.buttonId} onClick={this.handleGenerate}>
          Generate ID
        </button>
        {/* {Utils.createPortal(<AnotherComponent count={this.state.counter} />, document.getElementById('root') as HTMLDivElement)} */}
        {this.state.list.length < 10 ? (
          <AnotherComponent count={this.state.list.length} />
        ) : (
          <span>Basse</span>
        )}
        <ul ref={this.listRef}>
          {this.state.list.map((id, index) => (
            <li onClick={() => this.handleDelete(id)} id={`data-${index}`}>
              ITEM {(index + 1).toString()}: {id}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default DetailsComponent;
