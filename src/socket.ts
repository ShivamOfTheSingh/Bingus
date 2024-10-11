import { io } from "socket.io-client";

export const socket = io("ws://http://ec2-54-211-63-47.compute-1.amazonaws.com:3000/");
