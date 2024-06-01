import TestComponent from './components/TestComponent';
import Eninge from './core/Engine';
import TestService from './services/TestService';

const container = document.getElementById('root') as HTMLDivElement;
const app = new Eninge();
app.registerService([TestService]);
app.renderRoot(TestComponent, container);
