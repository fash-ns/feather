import JSXFacade from '../core/JSXFacade';
import Utils from '../core/Utils';
import Component from '../core/components/Component';

class Counter extends Component {
  public constructor(props: {}) {
    super(props);
    this.state = { count: 0 };
  }
  public render() {
    return (
      <div class="card">
        <button onClick={() => this.updateState((prev) => ({ count: prev.count + 1 }))}>
          count is {this.state.count.toString()}
        </button>
        {this.state.count < 10 ? (
          <p>
            Edit <code>src/App.tsx</code> to test how does it work
          </p>
        ) : Utils.createPortal((<p>
          basse
        </p>), document.body)}
      </div>
    );
  }
}

export default Counter;
