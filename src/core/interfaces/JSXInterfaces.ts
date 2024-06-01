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