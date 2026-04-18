import { io } from "socket.io-client";

export const socket = io("https://66c10dvz-3006.asse.devtunnels.ms/", {
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
});
