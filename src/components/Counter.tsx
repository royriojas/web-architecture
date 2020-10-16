import React from "react";
import { useStores } from "../mobx/use-stores";
import { Observer } from "mobx-react-lite";

export const Counter = () => {
  const { counter } = useStores();

  return (
    <div>
      <Observer>
        {() => (
          <>
            <p>Count:</p>
            <p>{counter.count}</p>
            <hr />
            <button onClick={counter.increment}>increment</button>
            <button onClick={counter.decrement}>decrement</button>
          </>
        )}
      </Observer>
    </div>
  );
};
