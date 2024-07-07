import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Register from "./components/auth/register/register";
import useSocket from "./hooks/useSocket";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/auth/login/Login";
import useGetUser from "./hooks/useGetUser";
import Room from "./components/room/Room";
import Home from "./components/home/Home";
import ChatDM from "./components/chat-DM/ChatDM";

// const socket = io("https://chat-vukz.onrender.com");
// const socket = io("http://localhost:5000");

function App() {
  // const { user } = useUser();
  const user = useGetUser()
  console.log('user from app ',user);
  const socket = useSocket();

  const connectSocket = () => {
    socket.on("connect", () => {
      console.log(socket);
    });
    // socket on => on == listener async, donc a chaque fois recieve an event will handle it-
  };

  useEffect(() => {
    connectSocket();
    // socket.on('recieved-message',msg=>setRecievedMessage(msg))
    socket.on("test-server", (msg) => {
      console.log(msg);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  
  console.log(user);

  return (
    <main className="min-h-screen flex justify-center flex-col gap-8 items-center">
      <h1 className="text-4xl font-semibold">Chatting !!</h1>
      <Routes>
        <Route
          path="/"
          element={!user ? <Navigate to={"/register"} /> : <Home/>}
        />
        <Route path="/login" element={user ? <Navigate to={'/'}/> : <Login/>} />
        <Route path="/register" element={user ? <Navigate to={'/'}/> : <Register />} />
        <Route path="/chat" element={<Chat/> }/>
        <Route path="/room" element={<Room/>} />
        <Route path="/chatDM" element={localStorage.getItem('token') ? <ChatDM/> : <Navigate to={'/'}/>} />
      </Routes>
      
    </main>
  );
}

export default App;
