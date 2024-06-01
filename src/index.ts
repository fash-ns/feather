import TestComponent from './components/TestComponent';
import Renderer from './core/dom-utils/Renderer';

const container = document.getElementById('root') as HTMLDivElement;
Renderer.renderRoot(TestComponent, container);