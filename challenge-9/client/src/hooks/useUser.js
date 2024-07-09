import { useContext } from "react";
import { UserContexts } from "../contexts/userContexts";

export default function useUser(){
    const context = useContext(UserContexts)
    if(!context){
        throw Error('hook must be inside Provider')
    }
    return context
}