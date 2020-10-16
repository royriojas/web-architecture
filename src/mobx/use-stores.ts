import { useContext } from "react";
import { StoresContext } from "./store-context";
import { Stores } from "./stores";

export const useStores = () => useContext<Stores>(StoresContext);
