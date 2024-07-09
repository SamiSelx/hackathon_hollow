import { useEffect, useState } from "react"


export default function Home(){
    const [users,setUsers] = useState([])
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
        
    },[])
    console.log(users);

    return(
        <div className="flex flex-col justify-center items-center">
            <ul>
                {users.map(user=>(
                    <li key={user._id}>{user.username}</li>
                ))}
            </ul>
        </div>
    )
}