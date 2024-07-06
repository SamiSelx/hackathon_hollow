import { createContext, useState } from "react";

export const UserContexts = createContext({})

export function UserProvider ({children}){
    const [user,setUser] = useState(null)
    return(
        <UserContexts.Provider value={{user,setUser}}>
            {children}
        </UserContexts.Provider>
    )
}