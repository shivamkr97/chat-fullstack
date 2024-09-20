import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import React, { useEffect } from 'react'
import { useState } from 'react'

function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("")
        }
    }

    useEffect(() => {
        const receiveMessage = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", receiveMessage);

        // Cleanup function to remove the event listener
        return () => {
            socket.off("receive_message", receiveMessage);
        };
    }, [socket]);

    return (
        <div>
            <div className=' flex  flex-col justify-center items-start'>
                <h1 className='text-3xl font-bold underline'>Live Chat</h1>
                <h1 className='text-xl mt-3 font-semibold'>Hi {username}</h1>
            </div>
            <div className='chat-body'>
                <ScrollArea className="h-72 w-full rounded-md border">
                    <div className="p-4">
                        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                        <>
                            {messageList.map((messageContent) => {
                                return (
                                    <div key={messageContent.time}
                                        className={`message p-2 rounded-md mb-2 ${username === messageContent.author ? "bg-blue-100 dark:text-black text-right" : "bg-slate-100 dark:text-black text-left"
                                            }`}
                                    >
                                        <div>
                                            <div className="message-content">
                                                <p className='text-sm font-semibold'>{messageContent.message}</p>
                                            </div>
                                            <div className="message-meta">
                                                <p className='text-xs' id=" text-xs">{messageContent.time}</p>
                                                <p className='text-xs' id=" text-xs">{messageContent.author}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>

                    </div>
                </ScrollArea>
            </div>
            <div className=' flex justify-center items-center mt-2 gap-2'>
                <Input type="text"
                    value={currentMessage}
                    placeholder="Hey..."
                    onChange={(event) => {
                        setCurrentMessage(event.target.value);
                    }}
                    onKeyPress={(event) => {
                        event.key === "Enter" && sendMessage();
                    }} />
                <Button onClick={sendMessage} >&#9658;</Button>
            </div>
        </div>
    )
}

export default Chat