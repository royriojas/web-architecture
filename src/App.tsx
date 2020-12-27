import React from 'react';
import './App.css';

import { Step1 } from './Step1';
import { Step2 } from './Step2';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

export default function App() {

  return (
    <Router>
      <div>
      <Switch>
        <Route path="/step1">
          <Step1 />
        </Route>
        <Route path="/step2">
          <Step2 />
        </Route>
        <Route path="/">
          <Redirect to="/step1" />
        </Route>
      </Switch>
      </div>
    </Router>
  );
}
