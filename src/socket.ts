import { io } from "socket.io-client";

export const socket = io("ws://http://ec2-54-81-37-78.compute-1.amazonaws.com:3000/");
