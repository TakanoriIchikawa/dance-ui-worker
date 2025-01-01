import Echo from "laravel-echo";
import { io } from "socket.io-client";

declare global {
  interface Window {
    io: typeof io;
    echo: Echo;
  }
}
