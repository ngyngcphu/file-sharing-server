import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@material-tailwind/react';
import { TerminalContextProvider } from "react-terminal";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ThemeProvider>
      <TerminalContextProvider>
        <ToastContainer limit={1} />
        <App />
      </TerminalContextProvider>
    </ThemeProvider>
  </BrowserRouter>
);
