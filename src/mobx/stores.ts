import { Counter } from "./models/counter";
import { Auth } from "./stores/AuthStore";

export type Stores = {
  counter: Counter;
  auth: Auth;
}

