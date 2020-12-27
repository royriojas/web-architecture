import React, { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("mount");
    const id = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => {
      console.log("unmount");
      clearInterval(id);
    };
  }, []);

  return <p>count: {count}</p>;
};

export const Step1 = () => {
  const [mounted, setMounted] = useState(false);
  return (
    <div className="App">
      <h1>Click to mount</h1>
      <button onClick={() => setMounted((mounted_) => !mounted_)}>
        {!mounted ? "Mount it!" : "Unmount it!"}
      </button>
      {mounted && <Counter />}
    </div>
  );
};
