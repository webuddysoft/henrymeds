import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  Route, 
  BrowserRouter,
  Routes
} from 'react-router-dom';
import theme from './libs/theme';
import Home from './pages';
import Clients from './pages/clients';
import Providers from './pages/providers';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/clients" element={<Clients />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
