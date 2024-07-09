import { useEffect } from "react";
import Register from "./components/auth/register/register";
import useSocket from "./hooks/useSocket";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/auth/login/Login";
import useGetUser from "./hooks/useGetUser";
import Home from "./components/home/Home";
import ChatDM from "./components/chat-DM/ChatDM";
import { Link } from "react-router-dom";
import useLogout from "./hooks/useLogout";

function App() {
  const user = useGetUser()
  console.log('user from app ',user);
  const socket = useSocket();
  const logout = useLogout()

 

  useEffect(() => {
    socket.on("connect", () => {
      console.log("user connect connected", user);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  
  console.log(user);

  return (
    <main className="min-h-screen flex justify-center flex-col gap-8 items-center">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-xl text-blue-500">CHAT APP</p>
        <div className="container mx-auto px-4 flex-1">
          {!user ? (
            <>
              <Link to={'/register'} className="  px-3 py-1 text-blue-500 font-semibold text-lg">Register</Link>
              <Link to={'/login'} className="  px-3 py-1 text-blue-500 font-semibold text-lg">Login</Link>
            </>
          ): <Link onClick={logout} to={'/login'}>LogOut</Link>}
        </div>
      </div>
      <h1 className="text-4xl font-semibold">Chatting !!</h1>
      <Routes>
        <Route
          path="/"
          element={!user ? <Navigate to={"/register"} /> : <Home/>}
        />
        <Route path="/login" element={user ? <Navigate to={'/'}/> : <Login/>} />
        <Route path="/register" element={user ? <Navigate to={'/'}/> : <Register />} />
        <Route path="/chatDM" element={localStorage.getItem('token') ? <ChatDM/> : <Navigate to={'/'}/>} />
      </Routes>
      
    </main>
  );
}

export default App;
