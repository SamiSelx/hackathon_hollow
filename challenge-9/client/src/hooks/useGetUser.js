import { useEffect } from "react";
import useUser from "./useUser";
import useSocket from "./useSocket";

export default function useGetUser(){
    const {user,setUser} = useUser()
    const socket = useSocket()
    useEffect(()=>{
        async function getUser(token){
            try {
                const response = await fetch('https://hackathon-hollow.onrender.com/api/user/me',{
                    method:'GET',
                    headers:{
                        'content-type':'application/json',
                        'Authorization':token
                    }
                })
                const data = await response.json()
                console.log(data);
                if(response.ok){
                    setUser(data.data)
                    socket.emit('join-room',data.data.room)
                }
            } catch (error) {
                console.log(error);
            }
        }
        const token = localStorage.getItem('token')
        if(token) {
            getUser(token)
        }

    },[])
    return user
}