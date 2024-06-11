import JSXFacade from 'feather-jsx/JSXFacade';
import Utils from 'feather-jsx/Utils';
import Component from 'feather-jsx/components/Component';

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
        <button onClick={() => this.updateState((prev) => ({ count: prev.count - 1 }))}>-</button>
        {this.state.count < 10 ? (
          <p>
            Edit <code>src/App.tsx</code> to test how does it work
          </p>
        ) : (
          Utils.createPortal(<p>basse</p>, document.body)
        )}
      </div>
    );
  }
}

export default Counter;
