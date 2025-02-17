import { BsThreeDotsVertical } from "react-icons/bs";
import logo from "../assets/logo.png";
import man from "../assets/man.png";
import UserCard from "../components/UserCard.tsx";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChatLeftText } from "react-icons/bs";
import { SlPeople } from "react-icons/sl";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state_manage/UserState.tsx";
import { useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { MdOutlineAttachEmail } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { SocketContext } from '../context/SocketContext.tsx';
import { onlineUsersState } from '../state_manage/onlineUsersState.tsx';

export const UserAndContact = ({
  onUserClick,
  onClickProfile,
  toggle,

}: {
  onUserClick: (
    receiverId: string,
    conversationId: string,
    img: string,
    userName: string,
    about: string,
    mobileViewType: string
  ) => void;

  onClickProfile: (
  ) => void;
  toggle: boolean;
}) => {
  const [allContactedUsers, setAllContactUsers] = useState<AxiosResponse | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); // State to toggle settings menu
  const [showThreeDotMenu, setShowThreeDotMenu] = useState(false);
  const [getNewMessageUsers, setGetNewMessageUsers] = useState(false);
  const [toggleRefresh, setToggleRefresh] = useState(false);
  const userData = useRecoilValue(userState);
  const setUserState = useSetRecoilState(userState);
  const { socketInstance } = useContext(SocketContext);
  const getOnlineUsers = useRecoilValue(onlineUsersState)

  useEffect(() => {
    socketInstance.on("newUserAdded", (isAddedNewUser) => {
      setGetNewMessageUsers(!getNewMessageUsers);
    });

    return () => {
      socketInstance.off("newUserAdded");
    };
  }, [socketInstance]);

  useEffect(() => {
    async function getAllContactedUsers() {
      const response: AxiosResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/getContactedUser`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setAllContactUsers(response.data);
      }
    }
    getAllContactedUsers();
  }, [toggle, getNewMessageUsers, getOnlineUsers]);


  const isUserOnline = (userId: string) => {
    return getOnlineUsers.some((user) => user.userId === userId);
  };

  const handleSettingsClick = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };

  const handleProfileClick = () => {
    setShowSettingsMenu(false);
    onClickProfile();
  };

  const handleLogoutClick = async () => {
    setShowSettingsMenu(false);
    const response: AxiosResponse = await axios.get(
      `${import.meta.env.VITE_SERVER_API}/logout`,
      {
        withCredentials: true,
      }
    );

    if(response.status === 200) {
      setUserState({
        isLoggedIn: false,
        id: null,
        username: null,
        email: null,
        profileImage: null,
        about: null,
      })
    }
  };

  return (
    <div className="w-full flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between py-2 bg-bg-300 shadow-lg rounded-sm">
        <div className="ml-2 flex gap-2">
          <img src={logo} alt="Talkify" width={30} height={30} />
          <span className="text-text-200 text-xl font-bold">Talkify</span>
        </div>
        <div className=" relative mr-2 cursor-pointer" onClick={() => setShowThreeDotMenu(!showThreeDotMenu)}>
          <BsThreeDotsVertical size={25} className="text-accent-100" />
          {showThreeDotMenu && (
            <div className="absolute right-6 top-0 bg-bg-100 shadow-lg rounded-lg px-2 py-[3px]">
              <a href="mailto:ubedpathan818@gmail.com" className="text-accent-100 flex justify-between gap-2">
                <MdOutlineAttachEmail size={24} />
                Admin
              </a>
            </div>
          )

          }
        </div>
      </div>

      {/* User Info */}
      <div className="relative flex justify-between items-center">
        <div className="flex justify-start gap-2 mt-4 ml-2">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-accent-100">
            <img
              src={userData.profileImage || man}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-accent-100 text-xl">
              {userData.username}
            </div>
            <div className="text-sm text-text-200">{userData.about}</div>
          </div>
        </div>

        {/* Settings Icon */}
        <div className="relative">
          <IoSettingsOutline
            size={20}
            className="text-text-200 mt-[8%] mr-2 cursor-pointer"
            onClick={handleSettingsClick}
          />
          {showSettingsMenu && (
            <div className="absolute right-2 top-10 z-10 bg-bg-300 shadow-lg rounded-lg p-2">
              <div
                className="cursor-pointer flex justify-between items-center gap-3 text-accent-100 hover:bg-bg-200 hover:rounded-lg transform duration-300 px-4 py-2"
                onClick={handleProfileClick}
              >
                <CgProfile size={20} />
                Profile
              </div>
              <div
                className="cursor-pointer flex justify-between items-center gap-3 text-accent-100 hover:bg-bg-200 hover:rounded-lg transform duration-300 px-4 py-2"
                onClick={handleLogoutClick}
              >
                <LuLogOut size={20} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
      <hr className="w-full border border-bg-300 mt-3" />

      {/* Contacts List */}
      <div className="flex-grow overflow-y-auto">
        <div className="text-xl font-semibold text-text-200 ml-2">
          Contacts
        </div>

        {(!allContactedUsers || allContactedUsers.length === 0) ? (
          <div className="flex flex-col items-center justify-center mt-10 text-center text-text-200">
            <p className="text-lg font-semibold">
              No conversations yet!
            </p>
            <p className="text-sm">
              Start a conversation with someone or explore new users to connect with.
            </p>
          </div>
        ) : (
          // Render contacted users if they exist
          allContactedUsers.map((conversation: any, index: number) => {
            const user = conversation.conversation[0];
            const online = isUserOnline(user.id);
            return (
              <UserCard
                key={conversation._id}
                conversationId={conversation._id}
                isOnline={online}
                receiverUserId={user.id}
                img={user.profileImageURL || man}
                userName={user.username}
                about={user.about}
                onClick={() => {
                  onUserClick(
                    user.id,
                    conversation._id,
                    user.profileImageURL || man,
                    user.username,
                    user.about,
                    "chat"
                  );
                }}
              />
            );
          })
        )}
      </div>

      <div className="md:hidden fixed bottom-0 left-0 bg-bg-300 w-full py-2">
        <div className="flex justify-evenly">
          <div
            className="flex flex-col items-center justify-center"
            onClick={() => onUserClick("", "", "", "", "", "userAndContact")}
          >
            <BsChatLeftText size={20} className="text-primary-300" />
            <span className="text-xs text-text-200">chats</span>
          </div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => onUserClick("", "", "", "", "", "newPeople")}
          >
            <SlPeople size={20} className="text-primary-300 cursor-pointer" />
            <span className="text-xs text-text-200">users</span>
          </div>
        </div>
      </div>
    </div>
  );
};
