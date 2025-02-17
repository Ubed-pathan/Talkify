import { useContext, useEffect, useState } from 'react'
import UserCard from '../components/UserCard'
import women from "../assets/women.png";
import { BsChatLeftText } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import axios, { AxiosResponse } from 'axios';
import { SocketContext } from '../context/SocketContext.tsx';
import { onlineUsersState } from '../state_manage/onlineUsersState.tsx';
import { useRecoilValue } from 'recoil';
export const NewPeople = ({
  onUserClick,
  toggle
}: {
  onUserClick: (recieverId:string, conversationId:string | null, img: string, userName: string, about: string, mobileViewType: string) => void;
}) => {
  const[allUsers , setAllUsers] = useState<AxiosResponse | null>(null);
  // const [toggleRefresh, setToggleRefresh] = useState(false);
  // const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [getNewMessageUsers, setGetNewMessageUsers] = useState(false);
  const getOnlineUsers = useRecoilValue(onlineUsersState)
  const { socketInstance } = useContext(SocketContext);
  

  // useEffect(() => {
  //   socketInstance.on("getUsers", (users: any[]) => {
  //     setOnlineUsers(users); 
  //     console.log(users, "all users executed in new people page");
  //   });
  //   return () => {
  //     socketInstance.off("getUsers");
  //   };
  // }, [socketInstance]);

  const isUserOnline = (userId: string) => {
    return getOnlineUsers.some((user) => user.userId === userId);
  };

  useEffect(() => {
    socketInstance.on("newUserAdded", (isAddedNewUser) => {
      setGetNewMessageUsers(!getNewMessageUsers);
    });

    return () => {
      socketInstance.off("newUserAdded");
    };
  }, [socketInstance]);

  useEffect(() => {
    async function getAllUsers() {
      const response : AxiosResponse = await axios.get(`${import.meta.env.VITE_SERVER_API}/getAllUsers`,{
        withCredentials: true
      })

      if(response.status === 200){
        setAllUsers(response.data)
      }
      else if(response.status === 404){
        // write code 
      }
    }
    getAllUsers();
  },[toggle, getNewMessageUsers, getOnlineUsers])


  
  return (
    <>
      <div className='flex flex-col h-screen'>
        <div className='flex justify-start py-1 gap-3 bg-bg-300'>
        <GoPeople size={30} className='text-accent-100 my-1 ml-3'/>
          <h2 className='text-text-200 text-xl font-bold my-1'>
            All Users
          </h2>
        </div>
        <hr className="w-full border border-bg-300" />

        <div className="flex-grow overflow-y-auto">
                    
          { allUsers?.map((user:any, index:Number) => 
            {
              const online = isUserOnline(user.id);
            
            return(
              <UserCard 
              key={user.id}
              conversationId={null}
              receiverUserId={user.id}
              isOnline={online}
              img={user.profileImageURL || women}
              userName={user.username}
              about={user.about}
              onClick={() => {
                onUserClick(user.id, null, user.profileImageURL || women, user.username, user.about, "chat")
              }
              }
            />
            )
            }
          )}

        </div>

        <div className="md:hidden fixed bottom-0 left-0 bg-bg-300 w-full py-2">
          <div className="flex justify-evenly">
            <div className="flex flex-col items-center justify-center"  onClick={() => onUserClick("","","", "", "", "userAndContact")}>
              <BsChatLeftText size={20} className="text-primary-300" />
              <span className="text-xs text-text-200">chats</span>
            </div>
            <div className="flex flex-col items-center justify-center cursor-pointer" onClick={() => onUserClick("","","", "", "", "newPeople")}>
              <SlPeople size={20} className="text-primary-300 cursor-pointer" />
              <span className="text-xs text-text-200">users</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
