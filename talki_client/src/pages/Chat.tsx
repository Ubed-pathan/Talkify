import { MdKeyboardBackspace } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import { IoIosAddCircleOutline } from "react-icons/io";
import { ReciverMessageCard } from "../components/messageCards/ReciverMessageCard";
import { SenderMessageCard } from "../components/messageCards/SenderMessageCard";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { userState } from "../state_manage/UserState";
import { useRecoilValue } from "recoil";
import { SocketContext } from "../context/SocketContext.tsx";
import { onlineUsersState } from "../state_manage/onlineUsersState.tsx";
import { SenderImageCard } from "../components/imageCards/SenderImageCard.tsx";
import { RiDeleteBinLine } from "react-icons/ri";
import ReciverImageCard from "../components/imageCards/ReciverImageCard.tsx";

export default function Chat({
  recieverId,
  conversationId,
  img,
  userName,
  about,
  onBack,
  toggle,
  setToggle,
}: {
  recieverId: string;
  conversationId: string;
  img: string;
  userName: string;
  about: string;
  onBack?: () => void;
  toggle: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [input, setInput] = useState({
    message: "",
  });
  const UserState = useRecoilValue(userState);
  const [messages, setMessages] = useState<any[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const onlineUsers = useRecoilValue(onlineUsersState);
  const [newConversationIdTemporary, setNewConversationIdTemporary] =
    useState(null);
  const { socketInstance } = useContext(SocketContext);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [isOnline, setIsOnline] = useState(true)

  // useEffect(() => {
  //   console.log("useEffect executed in chat component")
  //   socketInstance.on("getUsers", (users: any[]) => {
  //     console.log(users)
  //     setOnlineUsers(users);
  //   });

  //   // Cleanup listener
  //   return () => {
  //     socketInstance.off("getUsers");
  //   };
  // }, [socketInstance, recieverId, userName]);

  // const isUserOnline = (userId: string) => {
  //   return onlineUsers.some((user) => user.userId === userId);
  // };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user) => user.userId === userId);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketInstance.on("getMessage", ({ message, senderId, date }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, senderId, date },
      ]);
    });

    return () => {
      socketInstance.off("getMessage");
    };
  }, [socketInstance, messages]);

  useEffect(() => {
    async function getAllMessage() {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/message/getMessages`,
          {
            recieverId,
            conversationId,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setMessages(response.data);
        } else {
          setMessages([]);
        }
      } catch (err) {
        setMessages([]);
      }
    }
    getAllMessage();
  }, [userName]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInput((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit() {
    if (!input.message.trim()) {
      setInput({
        message: "",
      });
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      socketInstance.emit("sendMessage", {
        message: input.message,
        recieverId,
        senderId: UserState.id,
        date: currentDate,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { message: input.message, senderId: UserState.id, date: currentDate },
      ]);

      if (!conversationId) {
        if (newConversationIdTemporary) {
          conversationId = newConversationIdTemporary;
        }
      }

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/message`,
        {
          message: input.message,
          recieverId,
          conversationId,
          date: new Date().toISOString(),
        },

        {
          withCredentials: true,
        }
      );
      if (response.status == 201) {
        setNewConversationIdTemporary(response.data);
        setInput({ message: "" });
        setToggle(!toggle);
      }
    } catch (error) {
      //
    }
  }

  async function handleImageSubmit() {
    if (selectedImage) {
      try {
        // const currentDate = new Date().toISOString()
        // socketInstance.emit('sendImage', ({
        //   image: selectedImage,
        //   recieverId,
        //   senderId: UserState.id,
        //   date: currentDate
        // }))

        // setMessages(prevMessages => [
        //   ...prevMessages,
        //   { message: selectedImage, senderId: UserState.id, date: currentDate }
        // ]);

        if (!conversationId) {
          if (newConversationIdTemporary) {
            conversationId = newConversationIdTemporary;
          }
        }

        const formData = new FormData();
        const currentDate = new Date().toISOString();
        formData.append("image", selectedImage);
        formData.append("recieverId", recieverId);
        formData.append("conversationId", conversationId);
        formData.append("date", new Date().toISOString());

        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_API}/message/image`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 201) {
          setNewConversationIdTemporary(response.data.conversationId);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              contentURL: response.data.imageUrl,
              senderId: UserState.id,
              date: currentDate,
              typeOfMessage: "image",
            },
          ]);
          setSelectedImage(null);
          setOpenPreview(false);
          setToggle(!toggle);
        }
      } catch (error) {
        //
      }
    }
  }

  const handleFileSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent any default behavior

    if (fileInputRef.current) {
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 0);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setOpenPreview(true);
    }
  };

  return !userName ? (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-accent-100">
          Welcome to your chat space Talkify!
        </h1>
        <p className="text-text-200 mt-2 text-center">
          Select a friend to start a meaningful conversation, or reconnect with
          someone to brighten their day!
        </p>
      </div>
    </>
  ) : (
    <>
      <div className="flex flex-col items-center h-screen">
        <div className="flex justify-evenly w-[90%] mt-2 ">
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-full w-[17%] bg-bg-300 font-bold flex flex-col items-center justify-center shadow-lg"
            >
              <MdKeyboardBackspace size={30} className="text-accent-100" />
            </button>
          )}
          <div className="flex justify-start gap-2 items-center w-[70%] md:w-full bg-bg-300 shadow-lg rounded-full py-1">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-accent-100 ml-2">
              <img
                src={img}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[75%] md:w-[80%]">
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-accent-100">{userName}</span>
                {isUserOnline(recieverId) ? (
                  <span className="text-sm text-green-200 mr-6 ml-auto">
                    online
                  </span>
                ) : (
                  <span className="text-sm text-red-300 mr-6">offline</span>
                )}
              </div>
              <div className="text-sm text-text-200">{about}</div>
            </div>
          </div>
        </div>
        <hr className="w-full border border-bg-300 mt-3" />

        {openPreview ? (
          <>
            <div className="flex flex-col justify-center items-center w-full h-full bg-bg-300">
              <div className="flex flex-col justify-center items-center w-[90%]">
                {selectedImage && (
                  <div className="max-w-[60%] md:max-w-[40%] rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-full h-auto max-h-[300px] object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center justify-center gap-16 mx-5 w-[90%] mt-4">
                  <button
                    onClick={() => setOpenPreview(false)}
                    className="flex flex-col justify-center items-center"
                  >
                    <RiDeleteBinLine size={25} className="text-red-600" />
                    <span className="text-sm text-red-600">Delete</span>
                  </button>
                  <button
                    className="flex flex-col justify-center items-center"
                    onClick={() => {
                      setOpenPreview(false);
                      handleImageSubmit();
                    }}
                  >
                    <LuSendHorizontal size={25} className="text-accent-100" />
                    <span className="text-sm text-accent-100">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-grow overflow-y-auto justify-center w-full ">
              <div className="w-full mt-1">
                {messages?.map((message: any, index: number) => {
                  if (message.senderId === UserState.id) {
                    return message.typeOfMessage === "image" ? (
                      <>
                      <SenderImageCard
                        key={index}
                        image={message.contentURL}
                        date={message.date}
                        senderId={message.senderId}
                      />
                      </>
                      
                    ) : (
                      <SenderMessageCard
                        key={index}
                        message={message.message}
                        date={message.date}
                        senderId={message.senderId}
                      />
                    );
                  } else {
                    return message.typeOfMessage === "image" ? (
                      <ReciverImageCard
                        key={index}
                        image={message.contentURL}
                        date={message.date}
                        senderId={message.senderId}
                      />
                    ) : (
                      <ReciverMessageCard
                        key={index}
                        message={message.message}
                        date={message.date}
                        senderId={message.senderId}
                      />
                    );
                  }
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <hr className="w-full border border-bg-300 mt-2" />
            <div className=" flex justify-start md:gap-3 gap-2 w-full py-2">
              <div className="w-[85%] ml-2">
                <input
                  type="text"
                  name="message"
                  className="w-full p-2 bg-bg-300 rounded-full border-2 border-accent-100 outline-none focus:ring-0 focus:border-accent-100 text-text-200"
                  placeholder="Type a message"
                  required
                  value={input.message}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center items-center">
                <button onClick={handleSubmit}>
                  <LuSendHorizontal size={25} className="text-accent-100" />
                </button>
              </div>
              <div className="flex justify-center items-center mr-2">
                <button className="" onClick={handleFileSelect}>
                  <IoIosAddCircleOutline
                    size={25}
                    className="text-accent-100"
                  />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="absolute opacity-0 w-0 h-0"
                onChange={handleFileChange}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
