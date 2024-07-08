import { useState } from "react";
import useUser from "./useUser";
// import useSocket from "./useSocket";

export default  function useRegistre(){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const {user,setUser} = useUser()
    // const socket = useSocket()

    console.log(user);
    async function register(userRegistration) {
        setLoading(true)
      try {
        const response = await fetch("http://localhost:5000/api/user/register", {
          method: "POST",
          body: JSON.stringify(userRegistration),
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();
        console.log('data',data);
        if(response.ok) {
            setError(null)
            setUser(data.data)
            console.log('user',user);
            window.localStorage.setItem('token',`Bearer ${data.data.token}`)
            // socket.emit('online',data.data._doc._id) // send from backend user information
            location.pathname = '/chatDM'
            console.log('gg');
        } else setError(data.message)
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    }

    return {loading,error,register}

}