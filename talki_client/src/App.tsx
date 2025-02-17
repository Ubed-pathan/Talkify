import { useContext, useEffect, useState } from 'react';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from './state_manage/UserState';
import AppController from './AppController';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import OnRefreshGetUserData from './components/OnRefreshGetUserData';
import { SocketProvider, SocketContext } from './context/SocketContext';
import { onlineUsersState } from "./state_manage/onlineUsersState";
import CircularProgress from '@mui/material/CircularProgress';

function PageController() {
    const userData = useRecoilValue(userState);
    const { loading } = OnRefreshGetUserData();
    const [currentPage, setCurrentPage] = useState('signIn');
    const setUserData = useSetRecoilState(userState);
    const setOnlineUsers = useSetRecoilState(onlineUsersState);
    const socketContext = useContext(SocketContext);


    if (!socketContext) {
        throw new Error('SocketContext is not provided');
    }

    const { socketInstance } = socketContext;

    useEffect(() => {
        if (socketContext) {
            socketInstance.on('connect', () => {
            }); 

            socketInstance.on('disconnect', () => {
            });

        }

        return () => {
            socketInstance?.off('connect');
            socketInstance?.off('disconnect');
        };
    }, []);


    useEffect(() => {
        if (!socketInstance) return;

        socketInstance.emit('addUser', userData.id);

    }, [userData.id, userData.isLoggedIn, socketInstance]);

    useEffect( () => {
        socketInstance.on("getUsers", (users: any[]) => {
              setOnlineUsers(users);
          })
        
          return () => {
            socketInstance.off("getUsers");
          };

    },[socketInstance])

    const handleLogout = () => {
        setUserData({ isLoggedIn: false, id: null, username: null, about: null, profileImage: null, email: null });
        setCurrentPage('signIn');
    };

    const pageChangeToSignIn = () => {
        setCurrentPage('signIn');
    };

    const pageChangeToSignUp = () => {
        setCurrentPage('signUp');
    };

    if (loading) {
        return <div className='flex flex-col justify-center items-center w-screen h-screen bg-bg-200'><CircularProgress size={40} /></div>;;
    }

    return (
        <>
            {userData.isLoggedIn ? (
                <AppController onLogout={handleLogout} />
            ) : (
                <>
                    {currentPage === 'signUp' && <SignUp pageChangeToSignIn={pageChangeToSignIn} />}
                    {currentPage === 'signIn' && <SignIn pageChangeToSignUp={pageChangeToSignUp} />}
                </>
            )}
        </>
    );
}

function App() {
    return (
        <SocketProvider>
            <RecoilRoot>
                <PageController />
            </RecoilRoot>
        </SocketProvider>
    );
}

export default App;
