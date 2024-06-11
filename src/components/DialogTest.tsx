import JSXFacade from 'feather-jsx/JSXFacade';
import Component from 'feather-jsx/components/Component';
import type { JSXElement } from 'feather-jsx/interfaces/JSXInterfaces';
import { ComponentProps } from 'feather-jsx/interfaces/componentInterfaces';
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
        <Dialog open={this.state.openDialog} onClose={this.handleCloseDialog} />
      </div>
    );
  }
}

export default DialogTest;
