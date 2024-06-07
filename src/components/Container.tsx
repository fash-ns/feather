import JSXFacade from '../core/JSXFacade';
import PureComponent from '../core/components/PureComponent';
import { JSXElement } from '../core/interfaces/JSXInterfaces';

class Container extends PureComponent {
  public render(): JSXElement {
    return <container>{this.props.children}</container>;
  }
}

export default Container;
