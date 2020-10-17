import { Observer } from 'mobx-react-lite';
import React from 'react';
import './App.css';
import { Counter } from './components/Counter';
import { LoginForm } from './components/LoginForm';
import { useStores } from './mobx/use-stores';

function App() {
  const { auth } = useStores();

  return (
    <div className="App">
      <LoginForm />
      <Observer>
        {() => {
          return <>
            {auth.authenticated && <Counter />}
          </>
        }}
      </Observer>
    </div>
  );
}

export default App;
