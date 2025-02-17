import axios from "axios";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../state_manage/UserState";

const OnRefreshGetUserData = () => {
    const setUserData = useSetRecoilState(userState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUserStateOnRefresh() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/onRefreshGetUserData`, {
                    withCredentials: true
                });
                if (response.status === 201) {
                    setUserData({
                        isLoggedIn: true,
                        id: response.data.id,
                        username: response.data.username,
                        about: response.data.about,
                        email: response.data.email,
                        profileImage: response.data.profileImageUrl,
                    });
                } else if(response.status == 401) {
                    setUserData({
                        isLoggedIn: false,
                        id: null,
                        username: null,
                        about: null,
                        email: null,
                        profileImage: null,
                    });
                }
            } 
            finally {
                setLoading(false);
            }
        }

        getUserStateOnRefresh();
    }, [setUserData]);

    return { loading };
};

export default OnRefreshGetUserData;
