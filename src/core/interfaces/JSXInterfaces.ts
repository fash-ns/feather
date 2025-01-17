import type PureComponent from '../components/PureComponent';
import type { ClassConstructor } from './globalInterfaces';

export enum JSXElementType {
  Element,
  Component,
}

interface JSXSharedElementAttributes {
  props: Record<string, any> | null;
  children: Array<JSXElement | string>;
}

interface JSXNativeElement extends JSXSharedElementAttributes {
  type: JSXElementType.Element;
  tag: string;
}

interface JSXComponentElement extends JSXSharedElementAttributes {
  type: JSXElementType.Component;
  tag: ClassConstructor<PureComponent>;
}

export type JSXElement = JSXNativeElement | JSXComponentElement;

export type eventListenerProp = (e: Event) => void;

export interface JSXRenderedElement {
  type: JSXElementType;
  tag: string | PureComponent;
  props: Record<string, any> | null;
  eventListeners: Record<string, eventListenerProp>;
  element: HTMLElement | PureComponent;
  children: Array<JSXRenderedElement | Text>;
}
