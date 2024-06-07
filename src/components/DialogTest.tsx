import JSXFacade from '../core/JSXFacade';
import Utils from '../core/Utils';
import Component from '../core/components/Component';
import type { JSXElement } from '../core/interfaces/JSXInterfaces';
import { ComponentProps } from '../core/interfaces/componentInterfaces';
import TestService from '../services/TestService';
import Dialog from './Dialog';

interface DialogTestState {
  openDialog: boolean;
}

class DialogTest extends Component<ComponentProps, DialogTestState> {
  public constructor(props: ComponentProps) {
    super(props);
    this.state = { openDialog: false };
    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
  }

  public handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  public handleOpenDialog() {
    this.engine.getService<TestService>(TestService).greet();
    this.setState({ openDialog: true });
  }

  public render(): JSXElement {
    return (
      <div>
        <button onClick={this.handleOpenDialog}>Open Dialog</button>
        {Utils.createPortal(<Dialog open={this.state.openDialog} onClose={this.handleCloseDialog} />, document.body)}
      </div>
    );
  }
}

export default DialogTest;
