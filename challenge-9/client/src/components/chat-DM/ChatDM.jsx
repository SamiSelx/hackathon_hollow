import { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'
import useUser from "../../hooks/useUser"
import useSocket from "../../hooks/useSocket"
import { MdOutlineFilePresent } from "react-icons/md";
import { transformDate } from "../../utils/transformData";
import { Navigate } from "react-router-dom";

export default function ChatDM(){
    const [users,setUsers] = useState([])
    const [recieverId,setRecieverId] = useState('')
    const [messageList,setMessageList] = useState([])
    const [message,setMessage] = useState({message:'',file:null})
    const {user:userSender,setUser} = useUser()
    const socket = useSocket()
    const [room,setRoom] = useState('')
    const [isRoom,setIsRoom] = useState(false)
    const [errorRoom,setErrorRoom] = useState(null)
    const [chatName,setChatName]= useState('')
    const [onlineUsers,setOnlineUsers] = useState([])
    const [isSelected,setIsSelected] = useState(false)


    useEffect(()=>{
      async function getConversation(){
          const endpoint = isRoom ? 'room/'+recieverId :recieverId 
          try {
            const response = await fetch('http://localhost:5000/api/message/'+endpoint,{
              method:'GET',
              headers:{
                  'content-type':'application/json',
                  'authorization':localStorage.getItem('token')
              }
          })
          const data = await response.json()
          if(response.ok){
              console.log(data);
              data.data ? setMessageList(data.data.messages) : setMessageList([])
          }
          } catch (error) {
            console.log(error);
          }
      }
      if(recieverId) getConversation()
      if (userSender) {
        console.log("joining room");
        socket.emit("join-room", [userSender.id]);
        socket.on("recieve-message", (message) => {
          const room = userSender.room.find((r) => r == message.recieverId);
          if(room){
              if(recieverId !== message.recieverId) return
              setMessageList((list) => [...list, message]);
          }else{
            if ((message.recieverId == userSender.id) && (message.senderId == recieverId))
              setMessageList((list) => [...list, message]);
          }
        });
      }
      return ()=>{
        socket.off('recieve-message')
      }
  },[socket,recieverId])
  console.log('reciever ',recieverId);

    useEffect(()=>{
        // fetch all users
        async function getUsers(){
            try {
              const response = await fetch('http://localhost:5000/api/user',{
                method:'GET',
                headers:{
                    'content-type':'application/json',
                    'authorization':localStorage.getItem('token')
                }
            })
            const data = await response.json()
            console.log(data);
            if(response.ok){
                setUsers(data.data)
            }
            } catch (error) {
              console.log(error);
            }
        }
        getUsers()
        // if(userSender) socket.emit('online',userSender.id)  
        // socket.on('status-user',user=>{
        //   console.log('user is online ',user);
        //   setUserStatus(users=>[...users,user])
        // })
        // socket.on('disconnect',()=>{
        //   socket.emit('offline',userSender.id)
        // })
        if (userSender) {
          socket.emit("join-room", userSender.room);
          socket.emit('addOnlineUser',userSender.id)
        }
        socket.on('getOnlineUsers',users=>{
          console.log('online users',users);
          setOnlineUsers(users)
        })
    },[userSender,socket])
    
    function handleReciever(e,name){
        setChatName(name)
        setIsRoom(false)
        setRecieverId(e.target.id)
        setIsSelected(true)
    }
    function handleRoom(e,name){
      setIsRoom(true)
      setChatName(name)
      setRecieverId(e.target.id)
      setIsSelected(true)
    }
    async function handleSubmit(){
          const endpoint = isRoom ? 'room/'+recieverId :recieverId 
          if(message.message == "" && !message.file) return
        const formData = new FormData()
        formData.append('message',message.message)
        formData.append('file',message.file)
        try {
          const response = await fetch(`http://localhost:5000/api/message/send/${endpoint}`,{
            method:'POST',
            body:formData,
            headers:{
                'authorization':localStorage.getItem('token')
            }
        })
        const data = await response.json()
        console.log('sending message',data);
        if(response.ok){
          console.log(data.data.createdAt);
            setMessageList([...messageList,data.data])
            setMessage({message:'',file:null})
            console.log(data.data);
            socket.emit("message-dm", data.data);
            
        }
        } catch (error) {
          console.log(error);
        }
        
      }

      async function createAndJoinRoom(e){
        const endpoint = e.target.id
        if(room == "") return
        const response = await fetch('http://localhost:5000/api/room/'+endpoint,{
            method:'POST',
            body:JSON.stringify({roomName:room}),
            headers:{
                'content-type':'application/json',
                'authorization':localStorage.getItem('token')
            }
        })
        try {
            const data = await response.json()
            console.log(data);
            if(response.ok){
                console.log('joining room ',room);
                setUser({...userSender,room:[...userSender.room,room]})
                setErrorRoom(null)
            }else setErrorRoom(data.message)
            setRoom('')
        } catch (error) {
            console.log(error);
        }

      }
      if(!userSender) <Navigate to={'/'}/>
    return (
      <div className="container mx-auto px-4 flex justify-center  gap-10">
        {/* Users */}
        <ul className="flex flex-col gap-4">
          {users?.map(
            (user) =>
              userSender?.id !== user._id && (
                <li
                  key={user._id}
                  id={user._id}
                  className="px-2 py-4 bg-blue-400 rounded-md text-white cursor-pointer"
                  onClick={(e) => handleReciever(e,user.username)}
                >
                  {user.username}
                  {onlineUsers.find(us => us.id == user._id) ? <h1>online</h1> : <h1>Offline</h1>}
                </li>
              )
          )}
          <h2>Rooms : </h2>
          {userSender?.room?.map((roomName, index) => (
            <li
              onClick={(e) => handleRoom(e,roomName)}
              key={index}
              id={roomName}
              className="px-2 py-4 bg-green-400 rounded-md text-white cursor-pointer"
            >
              {roomName}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-8 flex-1">
          {/*Chat*/}
          <div className="flex flex-col gap-3 shadow-md h-96 justify-between p-4">
            <h1 className="text-2xl font-semibold text-center pb-2 border-b-2 border-b-blue-500">{chatName}</h1>
            <ScrollToBottom className="overflow-y-auto">
              <div className="flex flex-col gap-4 ">
                {messageList?.map((msg, index) => (
                  <div
                    key={index}
                    className={`${msg.senderId !== userSender.id ? "self-end items-end" : "self-start"} w-1/3 flex flex-col`}
                  >
                    <div>
                      <p
                        className={`px-4 py-2 w-fit rounded-full text-white ${msg.message.message == "" ? "hidden" : ""} ${
                          msg.senderId !== userSender.id
                            ? "bg-green-500"
                            : "bg-blue-500"
                        }`}
                      >
                        {msg.message.message}
                      </p>
                      {msg.message.filePath && (
                        <a
                          href={"http://localhost:5000" + msg.message.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer w-full h-full"
                        >
                          <img src={"http://localhost:5000" + msg.message.filePath} onError={e => e.target.src = './vite.svg'} className="h-1/3 w-1/3"/>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span>{users.find(user=>user._id == msg.senderId)?.username}</span>
                      <span className="text-base font-semibold">{transformDate(msg.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollToBottom>
            {recieverId != '' && isSelected && (
              <div className="border-t-2 border-black pt-4 flex justify-between items-center ">
                <input
                  className="ring-2 ring-gray-500 rounded-full mr-4 px-4 py-1 flex-1"
                  type="text"
                  placeholder="Message..."
                  value={message.message}
                  onChange={(e) =>
                    setMessage({ ...message, message: e.target.value })
                  }
                  onKeyDown={(e) => (e.key == "Enter" ? handleSubmit() : null)}
                />
                <div className="flex gap-2 items-center">
                  <label htmlFor="file" className="text-3xl cursor-pointer"><MdOutlineFilePresent /></label>
                  <input
                  className="hidden"
                    id="file"
                    type="file"
                    onChange={(e) =>
                      setMessage({ ...message, file: e.target.files[0] })
                    }
                  />
                <input
                  type="submit"
                  value={"Send Message"}
                  className="cursor-pointer py-3 px-4 font-semibold text-lg bg-green-500 text-white inline-block rounded-xl"
                  onClick={handleSubmit}
                />
                </div>
              </div>
            )}
          </div>
          {/*Create Rooms*/}
          <div className="flex flex-col gap-2">
            <input
              className="border rounded-lg ring-2 focus:outline-none px-3 py-1"
              type="text"
              name="room"
              value={room}
              placeholder="Room..."
              onChange={(e) => setRoom(e.target.value)}
            />
            {errorRoom && <p className="text-red-500 text-lg font-semibold">{errorRoom}</p>}
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-all duration-500 text-white text-lg rounded-full" id="create" onClick={(e) => createAndJoinRoom(e)}>
              Create Room
            </button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 transition-all duration-500 text-white text-lg rounded-full" id="join" onClick={(e) => createAndJoinRoom(e)}>
              Join
            </button>
          </div>
        </div>
      </div>
    );
}