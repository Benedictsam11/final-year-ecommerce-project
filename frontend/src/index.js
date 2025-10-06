import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ShopStoreProvider from './Store/ShopStore';  
import { BrowserRouter } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter></BrowserRouter>
    <ShopStoreProvider>
      <App />
    </ShopStoreProvider>
  </React.StrictMode>
);

reportWebVitals();
