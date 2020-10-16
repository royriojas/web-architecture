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
            <p>Double:</p>
            <p>{counter.countProp.double}</p>
            <hr />
            <button onClick={counter.decrement}>Decrement (-)</button>
            <button onClick={counter.increment}>Increment (+)</button>
          </>
        )}
      </Observer>
    </div>
  );
};
