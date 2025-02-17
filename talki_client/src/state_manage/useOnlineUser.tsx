// import { useState, useEffect } from "react";
// import { SocketContext } from "../context/SocketContext.tsx";
// import { useContext } from "react";
// import { useSetRecoilState } from "recoil";
// import { onlineUsersState } from "./onlineUsersState.tsx";

// const useOnlineUsers = () => {
//   const { socketInstance } = useContext(SocketContext);
//   const setOnlineUsers = useSetRecoilState(onlineUsersState);


//   useEffect(() => {
//     console.log("starting useOnlinefile ")
//     socketInstance.on("getUsers", (users: any[]) => {
//       console.log(users, "in useOnlineUsers");
//         setOnlineUsers(users);
//     })

//     // Cleanup the event listener on unmount
//     return () => {
//       socketInstance.off("getUsers");
//     };
//   }, [socketInstance]);
// };

// export default useOnlineUsers;
