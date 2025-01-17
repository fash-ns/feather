import JSXFacade from '../core/JSXFacade';
import PureComponent from '../core/components/PureComponent';
import type { JSXElement } from '../core/interfaces/JSXInterfaces';
import { ComponentProps } from '../core/interfaces/componentInterfaces';

interface AnotherComponentPropsType extends ComponentProps {
  count: number;
}

class AnotherComponent extends PureComponent<AnotherComponentPropsType> {
  public render(): JSXElement {
    return (
      <span>
        Button is clicked {this.props.count.toString()} time{this.props.count > 1 ? 's' : ''}
      </span>
    );
  }
}

export default AnotherComponent;
