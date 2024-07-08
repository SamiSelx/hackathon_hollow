import { useState } from "react"
import useLogin from "../../../hooks/useLogin"
import { Link } from "react-router-dom"

export default function Login(){
    const [userSignIn,setUserSignIn] = useState({email:'',password:''})
    const {loading,error,login} = useLogin()
    const handleLogin = (e)=>{
        setUserSignIn({...userSignIn,[e.target.name]:e.target.value})
    }
    const onSubmit = async (e)=>{
        e.preventDefault()
        login(userSignIn)
    }

    return(
        <div>
        <form onSubmit={onSubmit} className="flex flex-col gap-8">
          <input
            type="text"
            name="email"
            placeholder="Email..."
            value={userSignIn.email}
            onChange={handleLogin}
            className="px-4 py-2 rounded-md border focus:ring outline-none border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password..."
            value={userSignIn.password}
            onChange={handleLogin}
            className="px-4 py-2 rounded-md border focus:ring outline-none border-blue-500"
          />
          <input
            type="submit"
            value={loading ? "Login..." : "Login"}
            disabled={loading}
            className="bg-blue-500 py-2 text-white font-semibold text-xl rounded-lg cursor-pointer hover:bg-blue-700 transition-all duration-500 uppercase"
          />
        </form>
        {error && (
          <div className="text-red-500 text-2xl font-semibold">{error}</div>
        )}
        <p className="mt-4 text-end">
        <Link to={'/register'} className="px-3 py-1 text-blue-500 font-semibold text-lg">Register</Link>
      </p>
      </div>
    )
}