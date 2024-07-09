import { useContext } from "react";
import { SocketContexts } from "../contexts/socketContexts";

export default function useSocket() {
  const context = useContext(SocketContexts);
  if (!context) {
    throw Error("hook must be inside provider");
  }
  return context;
}
