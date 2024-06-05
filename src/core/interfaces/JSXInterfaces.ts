import type PureComponent from '../components/PureComponent';
import type { ClassConstructor } from './globalInterfaces';

/**
 * Elements created by JSX could be HTML native elements or a component.
 */
export enum JSXElementType {
  Element,
  Component,
}

/**
 * JSXElements created by JSXFacade.createElement are pure objects. props and children is always present in JSXElement despite it's type
 */
interface JSXSharedElementAttributes {
  props: Record<string, any> | null;
  children: Array<JSXElement | string>;
  portalElement?: HTMLElement;
}

/**
 * JSXElements which defines native HTML elements are known as JSXNativeElement.
 */
export interface JSXNativeElement extends JSXSharedElementAttributes {
  type: JSXElementType.Element;
  tag: string;
}

/**
 * JSXElements which defines compoennts are known as JSXNativeElement.
 */
export interface JSXComponentElement extends JSXSharedElementAttributes {
  type: JSXElementType.Component;
  tag: ClassConstructor<PureComponent>;
  instance?: PureComponent;
}

/**
 * JSXElement must be a native element or a component
 */
export type JSXElement = JSXNativeElement | JSXComponentElement;

/**
 * DomTree type after DOM is created according to virtual dom
 */
export interface DomTree {
  element: HTMLElement | Text | PureComponent;
  children: DomTree[];
}

/**
 * properties which sets a listener for an event should have a listener callback value. This type is the type of the listener callback.
 */
export type EventListenerProp = (e: Event) => void;

export interface RefObject<T> {
  current: T | null;
}
