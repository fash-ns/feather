import PureComponent from '../core/components/PureComponent';
import { JSXElement } from '../core/interfaces/JSXInterfaces';
import JSXFacade from '../core/JSXFacade';
import DetailsComponent from './DetailsComponent';

class TestComponent extends PureComponent {
  public render(): JSXElement {
    return (
      <div>
        <h1>Salam</h1>
        <DetailsComponent buttonId="button" />
      </div>
    );
  }
}

export default TestComponent;
