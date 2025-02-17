  import { useState } from "react";
  import { UserAndContact } from "./pages/UserAndContact.tsx";
  import Chat from "./pages/Chat.tsx";
  import { NewPeople } from "./pages/NewPeople.tsx";
  import ProfilePage from "./pages/ProfilePage.tsx";


  function AppController({ handleLogout }) {

    const [mobileView, setMobileView] = useState("userAndContact");
    const [toggle, setToggle] = useState(false);
    const [selectedUser, setSelectedUser] = useState(
      {
        recieverId: "",
        conversationId: "",
        img: "",
        userName: "",
        about: "",
      });


    const handleUserClick = (recieverId: string, conversationId: string, img: string, userName: string, about: string, mobileViewType: string) => {
      setSelectedUser({ recieverId, conversationId, img, userName, about });
      setMobileView(mobileViewType);
    };

    const onClickProfile = () =>{
      setMobileView('profile');
    }

    return (
      <>
        {/* Laptop/Desktop Layout */}
        { mobileView === "profile" ? (
          <ProfilePage onBack={() => setMobileView("userAndContact")}/>
        ) : (
          <>
          <div className="hidden md:flex bg-bg-100 min-h-screen">
          <div className="w-[25%] text-text-200 border-r border-text-200">
            <UserAndContact onUserClick={handleUserClick} onClickProfile={onClickProfile} toggle={toggle}/>
          </div>
          <div className="w-[50%] text-text-200 border-r border-text-200">
            <Chat recieverId={selectedUser.recieverId} conversationId={selectedUser.conversationId} img={selectedUser.img} userName={selectedUser.userName} about={selectedUser.about} toggle={toggle} setToggle={setToggle}/>
          </div>
          <div className="w-[25%] text-text-200">
            <NewPeople onUserClick={handleUserClick} toggle={toggle} />
          </div>
        </div>
          </>
        )

        }

        {/* Mobile Layout */}
        <div className="md:hidden bg-bg-100 min-h-screen">
          {mobileView === "userAndContact" && (
            <UserAndContact onUserClick={handleUserClick} onClickProfile={onClickProfile} toggle={toggle}/>
          )}
          {mobileView === "chat" && (
            <Chat
              recieverId={selectedUser.recieverId}
              conversationId={selectedUser.conversationId}
              img={selectedUser.img}
              userName={selectedUser.userName}
              about={selectedUser.about}
              onBack={() => setMobileView("userAndContact")}
              toggle={toggle} setToggle={setToggle}
            />
          )}
          {mobileView === "newPeople" && (
            <NewPeople onUserClick={handleUserClick} toggle={toggle}/>
          )}
        </div>
      </>
    )
  }

  export default AppController