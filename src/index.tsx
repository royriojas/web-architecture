import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Counter } from './mobx/models/counter';
import { Stores } from './mobx/stores';
import { StoresContext } from './mobx/store-context';
import { Auth } from './mobx/stores/AuthStore';
import { service } from './services/service';

const stores: Stores = {
  counter: new Counter(),
  auth: new Auth(service),
};

(window as any).__stores = stores;

ReactDOM.render(
  <React.StrictMode>
    <StoresContext.Provider value={stores}>
      <App />
    </StoresContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

