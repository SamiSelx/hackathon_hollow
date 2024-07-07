import { useEffect, useState } from "react"
import ScrollToBottom from 'react-scroll-to-bottom'
import useUser from "../../hooks/useUser"
import useSocket from "../../hooks/useSocket"
import { IoCloudDownloadOutline } from "react-icons/io5";

export default function ChatDM(){
    const [users,setUsers] = useState([])
    const [recieverId,setRecieverId] = useState('')
    const [messageList,setMessageList] = useState([])
    const [message,setMessage] = useState({message:'',file:null})
    const {user:userSender,setUser} = useUser()
    const socket = useSocket()
    const [selected,setSelected] = useState(false)
    const [room,setRoom] = useState('')
    const [roomNames,setRoomNames] = useState([])
    const [isRoom,setIsRoom] = useState(false)
    // const [rommList,setRoomList] = useState([])
    


    useEffect(()=>{
        // fetch all users
        async function getUsers(){
            const response = await fetch('http://localhost:5000/api/user',{
                method:'GET',
                headers:{
                    'content-type':'application/json',
                    'authorization':localStorage.getItem('token')
                }
            })
            const data = await response.json()
            if(response.ok){
                setUsers(data.data)
            }
        }
        getUsers()
        if(userSender){
            console.log('joining room');
            socket.emit('join-room',[userSender.id])
            socket.on('recieve-message',(message)=>{
              const isChannel = message.senderId == recieverId
              console.log('on channel ',isChannel);
              console.log('from recieve socket', message);
              console.log('from socket',userSender);
              
              console.log('inside socket' , messageList);
              console.log(isRoom,recieverId);
              
              // problem of listening, can't get recieveId and isRoom cuz event start on the first render so value won't change
              // const room = userSender.room.find(r => r == recieverId)
                 if((message.recieverId == userSender.id) && (message.senderId == recieverId)) setMessageList(list => [...list,message])
                //  if(isRoom){
                //   console.log('into room');
                //   if(message.recieverId == recieverId) setMessageList(list => [...list,message])
                // }else
            })

            
    }
    },[socket,userSender,recieverId])
    useEffect(()=>{
        async function getConversation(){
            console.log(recieverId);
            const endpoint = isRoom ? 'room/'+recieverId :recieverId 
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
        }
        getConversation()
    },[recieverId])
    function handleReciever(e){
        console.log(e.target.id);
        setIsRoom(false)
        setRecieverId(e.target.id)
        setSelected(true)
    }

    async function handleSubmit(){
        // console.log(socket.id);
        const endpoint = isRoom ? 'room/'+recieverId :recieverId 
        const formData = new FormData()
        formData.append('message',message.message)
        formData.append('file',message.file)
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
            setMessageList([...messageList,data.data])
            setMessage({message:'',file:null})
            socket.emit("message-dm", data.data);
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
                setUser({...userSender,room:[...userSender.room,room]})
            }
            setRoom('')
        } catch (error) {
            console.log(error);
        }

        console.log('joining room ',room);
      }
    //   async function createRoom(){
    //     const response = await fetch('http://localhost:5000/api/room/create',{
    //         method:'POST',
    //         body:JSON.stringify({roomName:room}),
    //         headers:{
    //             'content-type':'application/json',
    //             'authorization':localStorage.getItem('token')
    //         }
    //     })
    //     try {
    //         const data = await response.json()
    //         console.log(data);
    //         setUser({...userSender,room:[...userSender.room,room]})
    //         setRoom('')
    //     } catch (error) {
    //         console.log(error);
    //     }

    //     socket.emit("join-room",room)
    //   }
    useEffect(()=>{
        if(userSender){
            socket.emit("join-room",userSender.room);
        }
    },[userSender,room])

      function handleRoom(e){
        setIsRoom(true)
        setRecieverId(e.target.id)
        setSelected(true)
      }

    return (
      <div className="flex justify-between gap-10">
        {/* Users */}
        <ul className="flex flex-col gap-4">
          {users.map(
            (user) =>
              userSender.id !== user._id && (
                <li
                  key={user._id}
                  id={user._id}
                  className="px-2 py-4 bg-blue-400 rounded-md text-white cursor-pointer"
                  onClick={(e) => handleReciever(e)}
                >
                  {user.username}
                </li>
              )
          )}
          <h2>Rooms : </h2>
          {userSender?.room.map((roomName, index) => (
            <li
              onClick={(e) => handleRoom(e)}
              key={index}
              id={roomName}
              className="px-2 py-4 bg-green-400 rounded-md text-white cursor-pointer"
            >
              {roomName}
            </li>
          ))}
        </ul>
        {/*Chat*/}
        <div className="flex flex-col gap-3 shadow-md h-96 justify-between p-4">
          <ScrollToBottom className="overflow-y-auto">
            <div className="flex flex-col gap-2 ">
              {messageList.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.senderId !== userSender.id ? "self-end" : "self-start"
                  }
                >
                  <div>
                    <p
                      className={`px-4 py-2 w-fit rounded-full text-white ${
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
                  {/* <span>{msg.author}</span> */}
                  <span>{msg.createdAt}</span>
                </div>
              ))}
            </div>
          </ScrollToBottom>
          {selected && (
            <div className="border-t-2 border-black pt-4 ">
              <input
                className="ring-2 ring-gray-500 rounded-full mr-4 px-4 py-1"
                type="text"
                value={message.message}
                onChange={(e) =>
                  setMessage({ ...message, message: e.target.value })
                }
                onKeyDown={(e) => (e.key == "Enter" ? handleSubmit() : null)}
              />
              <input
                type="file"
                onChange={(e) =>
                  setMessage({ ...message, file: e.target.files[0] })
                }
              />
              <input
                type="submit"
                value={"Send Message"}
                className="cursor-pointer"
                onClick={handleSubmit}
              />
            </div>
          )}
        </div>
        {/*Create Rooms*/}
        <div>
          <input
            type="text"
            name="room"
            value={room}
            placeholder="Room..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button id="create" onClick={(e) => createAndJoinRoom(e)}>
            Create Room
          </button>
          <button id="join" onClick={(e) => createAndJoinRoom(e)}>
            Join
          </button>
        </div>
      </div>
    );
}