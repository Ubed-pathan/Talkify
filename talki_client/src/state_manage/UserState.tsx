import {atom} from 'recoil';

export const userState = atom({
    key:'userState',
    default: {isLoggedIn: false, id: null, username: null, email: null, about: null , profileImage: null},
})