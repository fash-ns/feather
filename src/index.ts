import TestComponent from './components/TestComponent';
import Renderer from './core/Renderer';

const container = document.getElementById('root') as HTMLDivElement;
const domTree = Renderer.renderRoot(TestComponent, container);
console.log(domTree);
