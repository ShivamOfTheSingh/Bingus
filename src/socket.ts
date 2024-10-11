import { io } from "socket.io-client";

export const socket = io("ws://ec2-3-90-106-242.compute-1.amazonaws.com:3000");