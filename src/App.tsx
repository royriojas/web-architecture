import React from 'react';
import './App.css';
import { Counter } from './components/Counter';
import { LoginForm } from './components/LoginForm';

function App() {
  return (
    <div className="App">
      <Counter />
      <LoginForm />
    </div>
  );
}

export default App;
