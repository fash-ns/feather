import JSXFacade from 'feather-jsx/JSXFacade';
import PureComponent from 'feather-jsx/components/PureComponent';
import { JSXElement } from 'feather-jsx/interfaces/JSXInterfaces';

class Container extends PureComponent {
  public render(): JSXElement {
    return <container>{this.props.children}</container>;
  }
}

export default Container;
