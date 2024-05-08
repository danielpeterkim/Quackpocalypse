import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Chat = ({ roomId, dataChannel, socket, recMessages}) => {
    const [inputMessage, setInputMessage] = useState("");
    const [sentMessages, setSentMessages] = useState([]);

    useEffect(() => {
        if (dataChannel) {
            // Listen for messages on the data channel
            dataChannel.onmessage = (event) => {
                setMessages((prevMessages) => [...prevMessages, { text: event.data, isSent: false }]);
            };
        }
    }, [dataChannel]);



    let messages = sentMessages.concat(recMessages).sort((a, b) => a.time - b.time);

    return (
        <div className="chat">
            <h2>Chat - Room: {roomId}</h2>
            <div className="message-list">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.isSent ? "sent" : "received"}`}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type a message..." />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
