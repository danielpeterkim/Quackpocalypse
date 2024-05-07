// import React, { useState, useEffect } from 'react';
// // import SimplePeer from 'simple-peer';
// import io from 'socket.io-client';

// const socket = io('http://localhost:5000'); 

// const Chat = () => {
//   const [peer, setPeer] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageText, setMessageText] = useState('');

//   useEffect(() => {
//     const peer = new SimplePeer({ initiator: true });

//     peer.on('signal', (data) => {
//       socket.emit('offer', data);
//     });

//     socket.on('offer', (data) => {
//       peer.signal(data);
//     });

//     socket.on('answer', (data) => {
//       peer.signal(data);
//     });

//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     setPeer(peer);

//     return () => {
//       peer.destroy();
//     };
//   }, []);

//   const sendMessage = (message) => {
//     socket.emit('message', message);
//   };

//   return (
//     <div>
//       <div>
//         {messages.map((message, index) => (
//           <div key={index}>{message}</div>
//         ))}
//       </div>
//       <input
//         type="text"
//         value={messageText}
//         onChange={(e) => setMessageText(e.target.value)}
//         placeholder="Type a message..."
//       />
//       <button onClick={() => sendMessage(messageText)}>Send</button>
//     </div>
//   );
// };

// export default Chat;
