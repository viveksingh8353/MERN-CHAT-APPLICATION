// src/pages/Chat.jsx
import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      text: input,
      sender: "You",
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-lg font-semibold shadow-md">
        🔥 ChatterBox - Real-Time Chat
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3 max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-20">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="bg-white p-3 rounded shadow w-fit">
                <p className="text-sm font-semibold">{msg.sender}</p>
                <p className="text-gray-700">{msg.text}</p>
                <span className="text-xs text-gray-400">{msg.time}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
