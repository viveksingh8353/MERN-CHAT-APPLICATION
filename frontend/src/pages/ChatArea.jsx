
import socket from "../socket.js"
import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { useGetMessageQuery, useSendMessageMutation } from "../featurs/messageApi";
import useGetRealTimeMess from "../hooks/useGetREalTimeMess";

const ChatArea = () => {
  const [newMessage, setNewMessage] = useState("");
  const { selectUser, user } = useSelector((store) => store.auth);
  const currentUserId = user?._id;

  // Custom hook for real-time updates via socket
  useGetRealTimeMess();

  // Fetching messages for selected user
  const {
    data: messagesData,
    isSuccess,
    isError,
    error,
    isLoading,
  } = useGetMessageQuery(selectUser?._id, {
    skip: !selectUser?._id,
  });

  const { message } = useSelector((store) => store.message);

  // Mutation for sending messages
  const [sendMessage, { isSuccess: sendSuccess }] = useSendMessageMutation();

  // Join socket room on mount
  useEffect(() => {
    if (currentUserId) {
      socket.emit("join", currentUserId);
    }
  }, [currentUserId]);

  // Handle message send
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMessage({
        receiverId: selectUser?._id, // ✅ typo fixed here
        text: newMessage,
      }).unwrap();

      setNewMessage("");
    } catch (err) {
      console.error("Message send failed:", err);
    }
  };

  useEffect(() => {
    if (sendSuccess) setNewMessage("");
  }, [sendSuccess]);

  // If no user is selected
  if (!selectUser) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Select a user to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gray-800 text-white flex items-center p-4 shadow-md">
        <img
          src={selectUser?.profilePic || "https://via.placeholder.com/40"}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h2 className="text-lg font-bold capitalize">{selectUser?.fullName}</h2>
          <p className="text-sm text-gray-300">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        {isLoading && <p>Loading messages...</p>}
        {isError && (
          <p className="text-red-500">Failed to load messages: {error?.message || "Error"}</p>
        )}
        {isSuccess && message?.length > 0 ? (
          message.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === currentUserId ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.senderId === currentUserId
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No messages yet. Say hi!</div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className={`ml-3 px-4 py-2 rounded-md text-white ${
              newMessage.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
