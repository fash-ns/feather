import JSXFacade from '../core/JSXFacade';
import PureComponent from '../core/components/PureComponent';
import type { JSXElement } from '../core/interfaces/JSXInterfaces';
import './App.css';
import Counter from './Couter';
import DialogTest from './DialogTest';

class App extends PureComponent {
  public render(): JSXElement {
    return (
      <div>
        <h1>Feather Framework</h1>
        <Counter />
        <DialogTest />
        <p class="read-the-docs">Inspired by React</p>
      </div>
    );
  }
}

export default App;
