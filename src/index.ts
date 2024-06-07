import AppComponent from './components/App';
import './components/index.css';
import Eninge from './core/Engine';
import TestService from './services/TestService';

const container = document.getElementById('root') as HTMLDivElement;
const app = new Eninge();
app.registerService(TestService, "Farbod");
app.renderRoot(AppComponent, container);
