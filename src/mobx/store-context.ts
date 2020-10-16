import { createContext } from "react";
import { configure } from "mobx";
import { Stores } from "./stores";
import { Counter } from "./models/counter";
import { Auth } from "./stores/AuthStore";

configure({ enforceActions: "observed" });

export const StoresContext = createContext<Stores>({ counter: {} as Counter, auth: {} as Auth });
