import ScrollToBottom from 'react-scroll-to-bottom'
import { useEffect, useState } from 'react';
import useSocket from '../../hooks/useSocket';
import useUser from '../../hooks/useUser';


export default function Chat(){
  const socket = useSocket()
  const {user} = useUser()
  const [messageList, setMessageList] = useState([]);
  const [message, setMessage] = useState("");
  console.log(user);

  const handleSubmit = () => {
    console.log(socket.id);
    socket.emit("message", {message,author:user.username,author_id:user.id,room:user.room});
    setMessageList((list) => [...list, {message,author:user.username,author_id:user.id}]);
    setMessage("");
    
  };
  useEffect(()=>{
      console.log('user inside fetch',user);
      fetch(`http://localhost:5000/api/room/${user?.room}`).then(res=>res.json()).then(data=>{
        console.log(data.data);
        setMessageList(data.data.conversation)
      }).catch(err=>console.log(err))
  },[user])

  useEffect(()=>{
    socket.on("recieved-message", (message_info) => {
      console.log(message_info.message, "from id :", message_info.author);
      setMessageList((list) => [...list, message_info]);
    });
    return ()=>{
        socket.disconnect()
      }
  },[socket])

    return(
      
      <>
        <h1 className='text-2xl font-semibold'><span className='font-bold text-blue-800'>Room:</span> {user && user.room == ''? 'Global' : user?.room}</h1>
        <div className="flex flex-col gap-3 shadow-md h-96 justify-between p-4">
        <ScrollToBottom className="overflow-y-auto">
          <div className="flex flex-col gap-2 ">
            {messageList.map((msg, index) => (
              <div key={index} className={msg.author_id !== user.id ? 'self-end' : 'self-start'}>
                <p className={`px-4 py-2 w-fit rounded-full text-white ${msg.author_id !== user.id ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {msg.message}
                </p>
                <span>{msg.author}</span>
              </div>
            ))}
          </div>
        </ScrollToBottom>
        <div className="border-t-2 border-black pt-4 ">
          <input
            className="ring-2 ring-gray-500 rounded-full mr-4 px-4 py-1"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e)=>e.key == 'Enter'? handleSubmit(): null}
          />
          <input
            type="submit"
            value={"Send Message"}
            className="cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
      </div>
      </>
    )
}