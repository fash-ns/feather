import JSXFacade from '../core/JSXFacade';
import Utils from '../core/Utils';
import Component from '../core/components/Component';
import { JSXElement, RefObject } from '../core/interfaces/JSXInterfaces';
import { ComponentProps } from '../core/interfaces/componentInterfaces';
import './dialog.css';

interface DialogProps extends ComponentProps {
  onClose: () => void;
  open: boolean;
}

interface DialogState {
  open: boolean;
}

class Dialog extends Component<DialogProps, DialogState> {
  private containerRef: RefObject<HTMLDivElement> = Utils.createRef();

  public constructor(props: DialogProps) {
    super(props);
    this.state = { open: props.open };
  }

  protected onPropsChange(
    prevProps: Omit<DialogProps, 'engine'>,
    newProps: Omit<DialogProps, 'engine'>,
  ): void {
    if (newProps.open === prevProps.open) return;
    if (newProps.open) {
      this.setState({ open: true });
    } else {
      setTimeout(() => {
        this.setState({ open: false });
      }, 300);
    }
  }

  protected onUpdateFinished(): void {
    if (this.props.open && this.state.open)
      setTimeout(() => {
        this.containerRef.current.classList.remove('fade');
      });
    else this.containerRef.current.classList.add('fade');
  }

  public render(): JSXElement {
    return this.state.open ? (
      <div ref={this.containerRef} onClick={this.props.onClose} class="dialog-container fade">
        <div class="dialog-body" onClick={(e: MouseEvent) => e.stopPropagation()}>
          Salam
        </div>
      </div>
    ) : (
      ''
    );
  }
}

export default Dialog;
