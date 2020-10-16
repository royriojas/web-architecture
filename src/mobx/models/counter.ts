import { makeAutoObservable } from "mobx";

export class Counter {
  _count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  _max = 0;

  increment = () => {
    this._count = this._count + 1;
    if (this._count > this._max) {
      this._max = this._count;
    }
  };

  decrement = () => {
    this._count = this._count - 1;
  };

  get count() {
    return this._count;
  }

  get max() {
    return this._max;
  }
}
