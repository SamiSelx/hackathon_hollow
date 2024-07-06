import { useState } from "react";
import useUser from "./useUser";

export default  function useRegistre(){
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const {user} = useUser()

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
        console.log(data);
        if(response.ok) {
            setError(null)
            // setUser({username:userRegistration.username,email:userRegistration.email,room:'',token:data.token})
            console.log(user);
            window.localStorage.setItem('token',`Bearer ${data.token}`)
            // location.pathname = '/chat'
            console.log('gg');
        } else setError(data.message)
      } catch (error) {
        console.log(error);
      }
      setLoading(false)
    }

    return {loading,error,register}

}