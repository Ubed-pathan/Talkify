import { useState } from "react";
import { BsCamera, BsInfoSquare } from "react-icons/bs";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { BiSolidEdit } from "react-icons/bi";
import logo from "../assets/logo.png";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state_manage/UserState";
import man from "../assets/man.png";
import axios from "axios";

const ProfilePage = ({ onBack }: { onBack: () => void }) => {
  const auth = useRecoilValue(userState);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempProfileImage, setTempProfileImage] = useState<string | null>(null);
  const [about, setAbout] = useState(auth?.about || "");
  const [isEditing, setIsEditing] = useState(false);
  const [aboutInput, setAboutInput] = useState(about || "");
  const [image, setImage] = useState<File | null>(null);
  const setUserData = useSetRecoilState(userState)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setTempProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveImage = async () => {
    setProfileImage(tempProfileImage);
    setTempProfileImage(null);
    if (image) {
      const formData = new FormData();
      formData.append('image', image)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/addProfileImage`,
        formData,
        {
          withCredentials: true,
        }
      )

      if (response.status === 201) {
        setUserData({
          isLoggedIn: true,
          id: response.data.id,
          username: response.data.username,
          about: response.data.about,
          email: response.data.email,
          profileImage: response.data.profileImageUrl,
        });
      }
    }
  };

  const handleCancelImage = () => {
    setTempProfileImage(null);
  };

  const handleAboutEdit = async () => {
    setAbout(aboutInput.slice(0, 24));
    setIsEditing(false);
    if (aboutInput === about) return;
    else {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_API}/addAbout`, { updatedAbout: aboutInput }, {
        withCredentials: true,
      })
      if (response.status === 201) {
        setUserData({
          isLoggedIn: true,
          id: response.data.id,
          username: response.data.username,
          about: response.data.about,
          email: response.data.email,
          profileImage: response.data.profileImageUrl,
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-bg-100">
      <div className="bg-bg-300 w-full py-2 flex justify-between items-center">
        <button
          className="bg-bg-100 p-2 rounded-full ml-3 shadow-lg"
          onClick={onBack}
        >
          <MdKeyboardBackspace size={30} className="text-accent-100" />
        </button>
        <div className="mr-3 flex items-center gap-4">
          <img src={logo} alt="Talkify" width={35} height={35} />
          <span className="text-text-200 text-xl font-bold">Talkify</span>
        </div>
      </div>

      <div className="flex flex-col items-center bg-bg-300 w-[90%] md:w-1/2 mt-10 py-10 rounded-xl shadow-lg">
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg border-2 border-accent-100">
            <img
              src={tempProfileImage || profileImage || auth.profileImage || man}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <label
            htmlFor="upload-image"
            className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600"
          >
            <BsCamera size={20} />
          </label>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {tempProfileImage && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSaveImage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={handleCancelImage}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="mt-6 text-center md:w-1/2 w-full">
          <hr className="text-text-200 h-[0.2px]" />
          <div className="flex justify-start items-center gap-4 ml-1 mt-2">
            <IoPerson size={28} className="text-accent-100" />
            <div className="flex flex-col justify-start items-start">
              <h1 className="text-sm text-accent-100">Username</h1>
              <h1 className="text-xl font-semibold text-text-200">
                {auth.username}
              </h1>
            </div>
          </div>
          <hr className="text-text-200 h-1 my-2" />

          <div className="w-full">
            {isEditing ? (
              <div className="w-full flex flex-col items-center justify-center gap-2 mt-2">
                <input
                  type="text"
                  value={aboutInput}
                  onChange={(e) => setAboutInput(e.target.value)}
                  maxLength={24}
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleAboutEdit}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-start gap-4 items-center">
                <BsInfoSquare size={28} className="text-accent-100 ml-1" />
                <div className="flex flex-col justify-start items-start">
                  <div className="flex justify-between gap-5">
                    <h1 className="text-accent-100">About</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-accent-100 hover:text-blue-500"
                    >
                      <BiSolidEdit size={18} />
                    </button>
                  </div>
                  <div className="mr-1 w-full">
                    <p className="text-text-100 text-lg">{about}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
