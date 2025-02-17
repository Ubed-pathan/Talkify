import { atom } from "recoil";

export const onlineUsersState = atom<any[]>({
  key: "onlineUsersState", // Unique key for this atom
  default: [], // Default value
});