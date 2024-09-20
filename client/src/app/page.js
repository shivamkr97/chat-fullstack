'use client';

import { io } from "socket.io-client";
import { useState } from "react";
import Chat from "@/component/Chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";

const socket = io("https://chat-app-socket-io-z8oa.onrender.com", {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export default function Home() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");


  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
    console.log(username, room)
  }
  return (
    <main className="flex flex-col items-center justify-between gap-6 p-24">
      <div className="flex gap-2 justify-center items-center">
        <h1 className="text-3xl font-bold underline">
          Welcome to the chat
        </h1>
        <div>
          <ModeToggle />
        </div>
      </div>
      <h3 className="text-2xl font-semibold">Join a Chat</h3>
      <Input onChange={(e) => setUsername(e.target.value)} className="max-w-[14rem]" type="text" placeholder="John..." />
      <Input onChange={(e) => setRoom(e.target.value)} className="max-w-[14rem]" type="text" placeholder="Enter Room Name" />
      <Button className="text-md" onClick={joinRoom} >Join a room</Button>
      <Chat socket={socket} username={username} room={room} />
    </main>
  );
}
