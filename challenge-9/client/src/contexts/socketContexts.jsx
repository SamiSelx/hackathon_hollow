import { createContext } from "react";
import io from 'socket.io-client'

const socket = io("http://localhost:5000");

export const SocketContexts = createContext({})

export function SocketProvider({children}){

    return(
        <SocketContexts.Provider value={socket}>
            {children}
        </SocketContexts.Provider>
    )
}

