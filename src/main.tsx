import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './Global.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css"
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Toaster />
    <App />
  </BrowserRouter>
  // </React.StrictMode>
)
